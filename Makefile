SHELL = /bin/sh
INPATH = .
TIMESTAMP = $(shell date +%F_%H%M)
OUTPATH = $(TIMESTAMP)-toggle-youtube-comments.zip

bundle: $(INPATH)
	zip -9 -r $(OUTPATH) $(INPATH) -x ".*" "*.md" "*.zip" "Makefile"

bump: search = ("version":[[:space:]]*").+(")
bump: replace = \1$(version)\2
bump:
ifndef version
	$(error Must set version. E.g. make bump version=3.0.0)
endif
	sed --in-place -E 's/$(search)/$(replace)/' manifest.json

release:
	@echo Not yet supported

test:
	@echo Not yet supported

clean:
	rm *.zip