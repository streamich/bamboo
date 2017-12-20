# make --trace

RUNTIME = duktape
TARGET = bamboo-$(RUNTIME)
CC = gcc
CFLAGS =
MKDIR_P = mkdir -p
DIR_BUILD = build
DIR_DIST = dist

dist/$(TARGET): src/$(TARGET).c build/$(RUNTIME).o
	$(CC) $(CFLAGS) -o dist/$(TARGET) -Isrc/ src/$(TARGET).c -lm build/$(RUNTIME).o -lm

build/%.o: src/%.c directories
	$(CC) $(CFLAGS) -c $< -o $@

directories:
	${MKDIR_P} ${DIR_BUILD} ${DIR_DIST}

clean:
	rm -rf $(DIR_BUILD)/ $(DIR_DIST)/
