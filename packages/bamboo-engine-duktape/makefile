# make --trace

RUNTIME = duktape
TARGET = bamboo-engine-$(RUNTIME)
CC = gcc

# IMPORTANT: Do not enable `-std=c99` in that case system call is defined as
# `int syscall()`, but we need `long syscall()`, everything will break if you
# enable `std=c99`.
#CFLAGS = -std=c99
CFLAGS =


$(TARGET): $(TARGET).c $(RUNTIME).o
	$(CC) $(CFLAGS) -o $(TARGET) -Isrc/ $(TARGET).c -lm $(RUNTIME).o

try: try.c $(RUNTIME).o
	$(CC) $(CFLAGS) -o try -Isrc/ try.c -lm $(RUNTIME).o

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f *.o *.a $(TARGET) try
