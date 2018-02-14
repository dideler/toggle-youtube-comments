SHELL = /bin/sh
INPATH = .
TIMESTAMP = $(shell date +%F_%H%M)
OUTPATH = $(TIMESTAMP)-toggle-youtube-comments.zip
MINIFY_DIR = _build/
MINIFY := $(shell command -v minify 2> /dev/null)

.PHONY: help bundle bump release test clean

help:
	@echo "Please use \`make <target>\` where <target> is one of:\n"
	@echo "  help      Shows this help and exits"
	@echo "  bundle    Creates a zip of the extension to upload to the Chrome Web Store"
	@echo "  bump      Changes the version number to the one provided"
	@echo "  clean     Cleans up all build artifacts"

compress: $(INPATH) | $(MINIFY_DIR)
ifneq ($(MINIFY),)
	minify --recursive $(INPATH) --output $(MINIFY_DIR)
	cp -r LICENSE icons $(MINIFY_DIR)
else
	$(error "minify is not available, please install from https://github.com/tdewolff/minify/tree/master/cmd/minify")
endif

$(MINIFY_DIR):
	mkdir $(MINIFY_DIR)

bundle: compress
bundle: $(MINIFY_DIR)
	zip -9 -r $(OUTPATH) $(MINIFY_DIR)

bump: prev_version = $(shell grep '"version":' manifest.json | cut -d\" -f4)
bump: search = ("version":[[:space:]]*").+(")
bump: replace = \1$(version)\2
bump:
ifndef version
	$(error Must set version. E.g. make bump version=3.0.0)
endif
	@sed --in-place -E 's/$(search)/$(replace)/' manifest.json
	@echo Changed version from $(prev_version) to $(version)

release:
	@echo Not yet supported

test:
	@echo Not yet supported

clean:
	-rm -r *.zip $(MINIFY_DIR)