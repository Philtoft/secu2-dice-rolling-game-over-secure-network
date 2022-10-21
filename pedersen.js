// Jeg skal kun bruge commitTo og verify

/**
 * 1) Committer decides a secret message m -> diceroll value
 * 2) Committer decides a random secret r
 * 3) Produces a commmitment c=C(m, r)
 * 4) Sends c
 * 5) Later reveals m and r?? Should only send r to reveal m? Sends r then sends m. We have TLS as encryption layer to make sure that our message cannot be read.
 * 6) Verifier is given c, m, r to check if C(m, r) = c
 */
