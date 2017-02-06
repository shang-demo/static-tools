.PHONY: all test clean static
generate:
	node app.js $(p)
static:
	gulp static
	cd static && hs
deploy:
	rsync --exclude .tmp --exclude node_modules -azvF -e "ssh -p 22" ../deploy/  feng@139.129.92.153:/home/feng/shang/static
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