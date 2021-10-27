FROM node:14-alpine as buildstep
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
RUN npm i --ignore-scripts
RUN find node_modules -path '*/esbuild/install.js' | xargs -rt -n 1 node
RUN npm run ngcc
COPY tsconfig.app.json tsconfig.base.json ngsw-config.json .browserslistrc angular.json tslint.json /workspace/
COPY src /workspace/src/
COPY tslint-rules /workspace/tslint-rules
COPY schematics /workspace/schematics
COPY projects /workspace/projects
COPY src /workspace/src
COPY scripts /workspace/scripts/
RUN npm run build:schematics && npm run synchronize-lazy-components -- --ci
RUN npm run build:icons
ARG configuration=production
RUN test "${configuration}" = 'local' && node scripts/init-local-environment.js || true
ARG serviceWorker
RUN node schematics/customization/service-worker ${serviceWorker} || true
RUN npm run ng -- build -c ${configuration}
COPY tsconfig.server.json server.ts /workspace/
RUN npm run ng -- run intershop-pwa:server:${configuration} --bundleDependencies
# remove cache check for resources (especially index.html)
# https://github.com/angular/angular/issues/23613#issuecomment-415886919
RUN test "${serviceWorker}" = "true" && sed -i 's/canonicalHash !== cacheBustedHash/false/g' /workspace/dist/browser/ngsw-worker.js || true
COPY dist/* /workspace/dist/

FROM node:14-alpine
COPY --from=buildstep /workspace/dist /dist
RUN cd dist && npm install
ARG displayVersion=
LABEL displayVersion="${displayVersion}"
ENV DISPLAY_VERSION=${displayVersion} NODE_PATH=/dist/node_modules PATH=$PATH:/dist/node_modules/.bin
ARG configuration=production
LABEL configuration="${configuration}"
EXPOSE 4200
USER nobody
HEALTHCHECK --interval=60s --timeout=20s --start-period=2s CMD node /dist/healthcheck.js
ENTRYPOINT ["sh","/dist/entrypoint.sh"]
