import * as _ from 'underscore.string';
// import prettyms from 'pretty-ms';
import parseDuration from 'parse-duration';
import ms from 'ms';


const aliasMap: Record<string, (str: string, ...args: any[]) => string> = {
  'pascalCase': _.classify,
  'encode64': (str) => Buffer.from(str).toString('base64'),
  'decode64': (str) => Buffer.from(str, 'base64').toString('utf-8'),
  'encodeHex': (str) => Buffer.from(str).toString('hex'),
  'decodeHex': (str) => Buffer.from(str, 'hex').toString('utf-8'),
  'humanMs': (str, long = false) => {
    const n = Number(str);
    if(isNaN(n)) return 'Error: input must be a number!';
    return ms(n, {long});
  },
  'parseMs': (str, long = false) => {
    const n = Number(str);
    if(!isNaN(n)) return `Error: input must be humanized like '1s', '10d'`;
    return ms(str).toString();
  },
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
