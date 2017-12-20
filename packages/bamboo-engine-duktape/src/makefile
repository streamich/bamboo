# make --trace

RUNTIME = duktape
TARGET = bamboo-$(RUNTIME)
CC = gcc
CFLAGS =


$(TARGET): $(TARGET).c $(RUNTIME).o
	$(CC) $(CFLAGS) -o $(TARGET) -Isrc/ $(TARGET).c -lm $(RUNTIME).o -lm

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f *.o *.a $(TARGET)
