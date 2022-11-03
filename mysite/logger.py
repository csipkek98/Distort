from datetime import datetime

now = datetime.now()


timestamp = now.strftime("%Y/%m/%d %H:%M:%S")

def log_message_error(message):
    if is_valid_message(message):
        log_message = f"[{timestamp}][ERROR] {message}\n"
        print(log_message)
        log = open("log.txt", "a")
        log.write(log_message)
        log.close()

def log_message_info(message):
    if is_valid_message(message):
        log_message = f"[{timestamp}][INFO] {message}\n"
        print(log_message)
        log = open("log.txt", "a")
        log.write(log_message)
        log.close()
        

def log_message_success(message):
    if is_valid_message(message):
        log_message = f"[{timestamp}][SUCCESS] {message}\n"
        print(log_message)
        log = open("log.txt", "a")
        log.write(log_message)
        log.close()

def is_valid_message(msg):
    now = datetime.now()
    global timestamp
    timestamp = now.strftime("%Y/%m/%d %H:%M:%S")
    if isinstance(msg, str):
        return True
    else:
        print(f"INVALID LOG MESSAGE, GOT '{type(msg)}' ")
        return False