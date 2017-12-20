# make --trace

RUNTIME = duktape
CC = gcc
CFLAGS =
MKDIR_P = mkdir -p
DIR_SRC = src
DIR_BUILD = build
DIR_DIST = bin

$(DIR_DIST)/runtime: $(DIR_SRC)/bamboo-$(RUNTIME).c $(DIR_BUILD)/$(RUNTIME).o
	$(CC) $(CFLAGS) -o $(DIR_DIST)/runtime -Isrc/ $(DIR_SRC)/bamboo-$(RUNTIME).c -lm $(DIR_BUILD)/$(RUNTIME).o -lm

$(DIR_BUILD)/%.o: $(DIR_SRC)/%.c directories
	$(CC) $(CFLAGS) -c $< -o $@

directories:
	${MKDIR_P} ${DIR_BUILD} ${DIR_DIST}

clean:
	rm -rf $(DIR_BUILD)/ $(DIR_DIST)/
