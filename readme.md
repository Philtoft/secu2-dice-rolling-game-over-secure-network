# Steps

1. Make http connection ✅
2. Implement pederson commitment scheme
3. Implement https

## Resources:

- https://github.com/christsim/pedersen-commitments/blob/master/src/pedersen.js
  How it's used:

1. generateRandom to generate private random r
2. uses commitTo to encrypt value
3. sends the private random value r
4. send the message

## Entire Process

1. Client creates a random dice roll value between 1 and 6
2. Client generates a random value (_r_) and stores it
3. Client should generate private secret (_s_) from 0 to q
4. Client should generate (_h_) from g^s mod p
5. Client creates a commit (_c_) from c=g^m h^r mod p
6. Client sends commitment c to server
7. Server repeats the exact same process when receiving commitment from client
8. Client receives commitment from server
9. Client sends random value r
10. Server receives clients random value r
11. Server sends its random value r'
12. Client receives servers value r'
13. Client sends m
14. Server receives m
15. Server sends m'
16. Client verifies that c = C(m, r)
17. Server verifies that c' = C(m', r')
