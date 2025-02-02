import { getAndRemoveConfig } from '../utils';
import { isAbsolutePath } from '../../router/util';

export const linkCompiler = ({
  renderer,
  router,
  linkTarget,
  compiler,
  isSidebar = false,
}) => {
  const link = (href, title = '', text) => {
    let attrs = [];
    const { str, config } = getAndRemoveConfig(title);

    title = str;

    if (
      !isAbsolutePath(href) &&
      !compiler._matchNotCompileLink(href) &&
      !config.ignore
    ) {
      const sidebarAbsolutePath = compiler.config.sidebarAbsolutePath;
      const basePath =
        typeof sidebarAbsolutePath === 'string'
          ? sidebarAbsolutePath
          : router.getBasePath();
      const relativeTo =
        isSidebar && sidebarAbsolutePath ? basePath : router.getCurrentPath();

      if (href === compiler.config.homepage) {
        href = 'README';
      }

      href = router.toURL(href, null, relativeTo);
    } else {
      if (!isAbsolutePath(href) && href.startsWith('./')) {
        href =
          document.URL.replace(/\/(?!.*\/).*/, '/').replace('#/./', '') + href;
      }
      attrs.push(href.indexOf('mailto:') === 0 ? '' : `target="${linkTarget}"`);
    }

    if (config.target) {
      attrs.push(`target="${config.target}"`);
    }

    if (config.disabled) {
      attrs.push('disabled');
      href = 'javascript:void(0)';
    }

    if (config.class) {
      attrs.push(`class="${config.class}"`);
    }

    if (config.id) {
      attrs.push(`id="${config.id}"`);
    }

    if (title) {
      attrs.push(`title="${title}"`);
    }

    return `<a href="${href}" ${attrs.join(' ')}>${text}</a>`;
  };
  renderer.link = link;
  return link;
};
