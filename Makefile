SHELL = /bin/sh
INPATH = .
TIMESTAMP = $(shell date +%F_%H%M)
OUTPATH = $(TIMESTAMP)-toggle-youtube-comments.zip

.PHONY: help
help:
	@echo "Please use \`make <target>\` where <target> is one of:\n"
	@echo "  help      Shows this help and exits"
	@echo "  bundle    Creates a zip of the extension to upload to the Chrome Web Store"
	@echo "  bump      Changes the version number to the one provided"
	@echo "  clean     Cleans up all build artifacts"

bundle: $(INPATH)
	zip -9 -r $(OUTPATH) $(INPATH) -x ".*" "*.md" "*.zip" "Makefile"

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
	-rm *.zip