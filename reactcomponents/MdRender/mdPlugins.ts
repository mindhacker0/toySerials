// more about plugin,refer https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md
export interface Token {
  attrs:Object|null;
  block:boolean;
  children:Token[]|null;
  content:string;
  hidden:boolean;
  info:string;
  level:number;
  map:number[]|null;
  markup:string;
  meta:Object|null;
  nesting:number;
  tag:string;
  type:string;
}
export interface tokenHead { // token 流
  level:number;
  anchor:string;
  content:string;
}
export interface Plugin {// 标准插件
  plugin(md:any, params:any):any;
  opts?:object | any;
}
export interface CustomPlugin {// 自定义插件
  pluginName:string;
  opts?:object | any;
}
interface extractHeadPluginParams {// 获取标题的参数
  callback(headings:tokenHead[], tokens:any):any;
}
interface LinkPluginParams {// 自定义路径解析参数
  repoPath:string;
  linkUrlCovert?(strRaw:string):string;
  imageSrcCovert?(strRaw:string):string;
}
const makeSafe = function(label:string) { // 构造id标记
  return label.replace(/[^\w\s]/gi, '').split(' ').join('_');
};
export function pathIsRelative(str:string) { // 判断是否是相对路径的链接
  return /^(\.{1,2}(\/\.{1,2})*)?\/?([^\0\/]+(\/[^\0\/]+)*)?\/?$/.test(str);
}
// 获取内容最多三级标题插件 解析的时候给标题加上id,通过#id进行索引
export function extractHeadPlugin(md:any, params:extractHeadPluginParams):any {
  // 给标题添加链接
  md.renderer.rules.heading_open = function(tokens:Token[], index:number) {
    const level = tokens[index].tag;
    const label = tokens[index + 1];
    if (label.type === 'inline') {
      const anchor = makeSafe(label.content) + '_' + label.map![0];
      return '<' + level + '><a id="' + anchor + '"></a>';
    } else {
      return '</h1>';
    }
  };
  // 过滤捕获token流中的标题
  function filterTokens(tokens:Token[]) {
    const headings:tokenHead[] = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'heading_close') {
        continue;
      }
      const token = tokens[i];
      const heading = tokens[i - 1];
      if (heading.type === 'inline') {
        let content = heading.content;
        if(heading.children?.length) content = heading.children.map(v=>v.type === "text"?v.content:"").join("");
        headings.push({
          level: +token.tag.substr(1, 1),
          anchor: makeSafe(heading.content) + '_' + heading.map![0],
          content
        });
      }
    }
    params?.callback && params.callback(headings, tokens);
  }
  md.core.ruler.push('grab_state', function(state:any) {
    filterTokens(state.tokens);
  });
};
// markdown渲染链接处理
export function linkCovertPlugin(md:any, params:LinkPluginParams):any {
  // 内部a标签链接处理
  md.renderer.rules.link_open = function(tokens:any, idx:number, options:any, env:any, self:any) {
    const attrs = tokens[idx]['attrs'];
    for (let i = 0; i < attrs.length; ++i) {
      if (attrs[i][0] === 'href' && pathIsRelative(attrs[i][1])) {
        attrs[i][1] = typeof params.linkUrlCovert === 'function' ? params.linkUrlCovert(attrs[i][1]) : (attrs[i][1]);
      }
    }
    return self.renderToken(tokens, idx, options);
  };
  // 处理内部图片链接处理
  md.renderer.rules.image = function(tokens:any, idx:number, options:any, env:any, self:any) {
    const attrs = tokens[idx]['attrs'];
    for (let i = 0; i < attrs.length; ++i) {
      if (attrs[i][0] === 'src' && pathIsRelative(attrs[i][1])) {
        attrs[i][1] = typeof params.imageSrcCovert === 'function' ? params.imageSrcCovert(attrs[i][1]) :attrs[i][1];
      }
    }
    return self.renderToken(tokens, idx, options);
  };
}
// 通过此方法获取自带的插件
export function useDefinePlugin(name:string, opts?:object):Plugin|null {
  const customPluginMap = new Map<string, Plugin['plugin']>([
    ['extractHeadPlugin', extractHeadPlugin],
    ['linkCovertPlugin', linkCovertPlugin]
  ]);
  return customPluginMap.get(name) ? { plugin: customPluginMap.get(name) as Plugin['plugin'], opts } : null;
}
