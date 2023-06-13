a=int(input("enter a : "))
b=int(input("enter b : "))
def sum(a,b):
    return a+b
def diff(a,b):
    if a>b:
      return a-b
    else:
      return b-a
def mul(a,b):
    return a/b
def div(a,b):
    return a/b
print("Give option : \n 1 for Add\n 2 for subtract\n 3 for multiply\n 4 for division")
option=int(input())
if option==1:
    print("sum is",sum(a,b))
elif option==2:
    print("diff is",diff(a,b))
elif option==3:
    print("mul is",mul(a,b))
elif option==4:
    print("div is",div(a,b))
else :
  print("error")
