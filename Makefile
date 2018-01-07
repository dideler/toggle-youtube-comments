SHELL = /bin/sh
INPATH = .
TIMESTAMP = $(shell date +%F_%H%M)
OUTPATH = $(TIMESTAMP)-toggle-youtube-comments.zip

bundle: $(INPATH)
	zip -9 -r $(OUTPATH) $(INPATH) -x ".*" "*.md" "*.zip" "Makefile"

release:
	@echo Not yet supported

test:
	@echo Not yet supported

clean:
	rm *.zip