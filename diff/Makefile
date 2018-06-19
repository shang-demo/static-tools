.PHONY:*
prodNodeEnv:=$(shell cat Makefile.rsync.env.private 2>&1)

start:
	webpack-dev-server --config config/webpack.config.js --mode development
local:
	NODE_ENV=local npm run build && cd dist && hs
build:
	@ bash config/script-tools/index.sh build $(RUN_ARGS)
push:
	@ bash config/script-tools/index.sh push $(RUN_ARGS)
test:
	@ bash config/script-tools/index.sh test $(RUN_ARGS)
copy:
	@ bash config/script-tools/index.sh copy $(RUN_ARGS)
merge:
	git fetch template v1
	git merge remotes/template/v1


ifeq ($(firstword $(MAKECMDGOALS)), $(filter $(firstword $(MAKECMDGOALS)),build push now copy))
  # use the rest as arguments for "run"
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(RUN_ARGS):;@:)
endif