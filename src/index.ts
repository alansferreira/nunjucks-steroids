import * as _ from 'underscore.string';
// import prettyms from 'pretty-ms';
import parseDuration from 'parse-duration';
import * as ms from 'ms';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const aliasMap: Record<string, (str: string, ...args: any[]) => string> = {
  'pascalCase': _.classify,
  'encode64': (str) => Buffer.from(str).toString('base64'),
  'decode64': (str) => Buffer.from(str, 'base64').toString('utf-8'),
  'encodeHex': (str) => Buffer.from(str).toString('hex'),
  'decodeHex': (str) => Buffer.from(str, 'hex').toString('utf-8'),
  'duration': (str, long = false) => {
    const n = Number(str);
    if(!isNaN(n)) return ms(n);
    if(isNaN(n)) return ms(str, {long}).toString();
  },
  'date': (str, format, ...args: any[])=>{
    let result: dayjs.Dayjs = dayjs();
    if(typeof result[format] === 'function') {
      result = dayjs(str)
      result = result[format](...args);
    } else {
      result = dayjs(str, format);
    }
    return result.toString();
  }
}

export function bind(env: {getFilter: (name: string)=> Function}){
  const _getFilter = env.getFilter;
  env.getFilter = function (name: string) {

    // if exists function on 'underscore' bypass to 'underscore'
    if(_[name]) return _[name];
    /** add alias to 'underscore' prefixing with '_'
     *  like '{{ value | _camelize }}' => {{ value | _.camelize}}
     */
    if(name.startsWith('_') && _[name.substring(1)]) return _[name.substring(1)];

    // extended custom filters
    if(aliasMap[name]) return aliasMap[name];

    // use default filters
    return _getFilter.bind(env)(name);
  }
  return env;
}
