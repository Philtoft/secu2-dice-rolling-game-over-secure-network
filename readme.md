# Steps

1. Make http connection ✅
2. Generate secret
3. Implement pederson commitment scheme ✅
4. Implement https

## Resources:

https://github.com/Azero123/simple-js-pedersen-commitment/

## Entire Process

1. Client: generates random dice value ✅
2. Client: sends commit message c to server ✅
3. Server: receives commit message from client ✅
4. Server: generates random dice value ✅
5. Server: sends commit message c' to client ✅
6. Client: receives server commit ✅
7. Client: sends random value r to server ✅
8. Server: receives random value r ✅
9. Server: sends secret value s to client ❌
10. Client: receives secret value s from server ❌
11. Client: sends message m to server ❌
12. Server: receives message m from client ❌
13. Server: sends message m' to client ✅
14. Client receives message m' from server ✅
15. Client verifies that c=C(m,r)
16. Server verifies that c'=C(m', r')

## Old

4. Client receives commitment from server
5. Client sends random value r
6. Server receives clients random value r
7. Server sends its random value r'
8. Client receives servers value r'
9. Client sends m
10. Server receives m
11. Server sends m'
12. Client verifies that c = C(m, r)
13. Server verifies that c' = C(m', r')
