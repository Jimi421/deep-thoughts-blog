while True:
    try:
        x = int(input("What's x? "))
    except ValueError: 
        print("NUMBER!!")
    else:
        break
        
        
print(f"X is {x}")    