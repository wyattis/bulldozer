maxLevel=60
minLevel=1
#location="scores/"




for level in range(minLevel,maxLevel+1):
        with open( "levelLinks.txt","a+") as file:
                file.write("<a href")