.PHONY: all test clean static
current_dir = $(shell pwd)
push:
	git add -A 
	git commit -m "auto"
	git push origin master:master
static:
	rm -rf static
	rm -rf /Users/zhufeng/shang/GitHub/static/public
	rm -rf /Users/zhufeng/shang/GitHub/static/static
	cp -r ./ /Users/zhufeng/shang/GitHub/static/public
	cd /Users/zhufeng/shang/GitHub/static/public && gulp static
	mv /Users/zhufeng/shang/GitHub/static/static $(current_dir)/static
	cd $(current_dir)/static && hs
pushStatic:
	cd static && rm -rf .git && git init
	cd $(current_dir)
	cp .git/config static/.git 
	cd $(current_dir)/static && git add -A  && git commit -m "auto" && git push origin master:gh-pages -f
