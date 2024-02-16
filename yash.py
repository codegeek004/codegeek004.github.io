
a=int(input("enter the value"))
b=int(input("Enter the value"))
if(a<b):
  c=a
else:
  c=b
for i in range(c,0,-1):
  a%i==0 and b%i==0
  break
gcd=i
print("GCD of", a, "and" , b, "is" ,gcd)




#Fibonacci sequence of a number
a=0
b=1
sum=0
end=int(input("Enter the value"))
while(sum<=end):
  sum=a+b
  a=b
  b=sum
  if sum>end:
    break
  else:
    
    print(sum)



