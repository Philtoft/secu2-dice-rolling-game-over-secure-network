# Steps

1. Make http connection ✅
2. Implement pederson commitment scheme
3. Implement https

## Resources:

https://github.com/Azero123/simple-js-pedersen-commitment/

## Entire Process

1. Client: generates random dice value
2. Client: sends commit message c to server
3. Server: receives commit message from client
4. Server: generates random dice value
5. Server: sends commit message c' to server

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
