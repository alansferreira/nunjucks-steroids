import * as _ from 'underscore.string';

const aliasMap = {
  'pascalCase': _.classify,
  'base64': (str: string) => Buffer.from(str).toString('base64'),
  'encode64': (str: string) => Buffer.from(str).toString('base64'),
  'decode64': (str: string) => Buffer.from(str, 'base64').toString('utf-8'),
  'encodeHex': (str: string) => Buffer.from(str).toString('hex'),
  'decodeHex': (str: string) => Buffer.from(str, 'hex').toString('utf-8'),
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
