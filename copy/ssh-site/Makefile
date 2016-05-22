.PHONY: all test clean static
static:
	gulp static
	cd static && hs
push:
	git push origin master
test:
	@ if [ -n "$(g)" ]; \
	then \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test; \
	else \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail test; \
	fi
pushStatic:
	cd ./static && git add -A && git commit -m "auto" && git push origin master:gh-pages -f;