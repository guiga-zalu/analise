const V3 = require('./v3');

var A0, K, L;

/*
] E o corpo escalar, V o corpo vetorial
Suposições:
(1) Não existe operação e + v, onde e\in E^*, v\in V

Por Fibonacci:
a_{n + 1} = K a_n + L
\lim_{n\to\infty} a_{n + 1} = \lim_{n\to\infty} K a_n + L = \lim_{n\to\infty} a_n = a
\Rightarrow 0 = a(K - 1) + L
\Rightarrow L = a(1 - K)
\Rightarrow \dfrac{L}{1 - K} = a

a_{n + 1}\in V
\iff K a_n + L\in V
\iff K a_n, L\in V\because (1)
\iff a_n, L\in V

\therefore a\in V\iff L\in V
a = \dfrac{L}{1 - K}\iff K\in E\because (1)

Supondo série:
a = \lim_{n\to\infty} [K + {L\over x}]\circ^n x
\Rightarrow
\lim_{n\to\infty} a_{n + 1} = \lim_{n\to\infty} a_n = \lim_{n\to\infty} K + L / a_n
\Rightarrow a = K + L / a

] V = \mathbb{V}^3:
\Rightarrow a^2 = K a + L = \vec{0}
\Rightarrow K a = - L
\Rightarrow a = - L / K


1: \forall x\in E


2: \forall x\in V


*/
A0 = V3.Zero;
K = 0