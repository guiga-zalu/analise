# Testes com vetores

$a_{n+1} = k a_n + l a_{n-1}$

$\phi_{n+1} := a_{n+1\over n} = k + l a_{n-1\over n} = k + {l\over\phi_n}$

$\phi_{n+1}\phi_n = k\phi_n + l$

$\phi^2 = k\phi + l\iff\phi=\dfrac{k\pm\sqrt{k^2+4l}}{2}$

$l \in V => k a_n + l a_{n-1} \in V => a_{n + 1}, k a_n \in V$

$\therefore a \in V$ e $k a_n \in V$:

## SPG[$k a_n$, $l a_{n-1}$]: $k a_n$ pode ser

### (A) Uma multiplicação por escalar $k \in E$

1. k um escalar arbitrário.
   Ex: $a_{n+1} = k a_n + l a_{n-1}$
2. k é resultado escalar de alguma operação (dimensão 1) ($k = k\circ (a,\,n)$):
   1. k é uma contração direta. $\\$
      Ex: $k = a_n\cdot Q : Q\in V\Rightarrow a_{n+1} = \left[a_n\cdot Q\right] a_n + l a_{n-1}$
         1. $Q$ é um vetor arbitrário
         2. $Q=a_{n-m} : m\in 1..3\\$
            Ex: $a_{n+1}=\left[a_n\cdot a_{n-m}\right]a_n + la_{n-1}$
   2. k é uma contração que representa a colinearidade de dois vetores. $\\$
      Ex: $k = \hat{a_n}\cdot \hat{Q} : Q\in V\Rightarrow a_{n+1} = \cos\circ ang(a_n, Q) a_n + l a_{n-1}$
         1. $Q$ é um vetor arbitrário
         2. $Q=a_{n-m} : m\in 1..3\\$
            Ex: $a_{n+1}=\cos\circ ang(a_n, a_{n-m})a_n + la_{n-1}$
   3. k é um módulo. $k=|a_{n-m}|\,:m\in 1..3\\$
      Ex: $a_{n+1}=|a_{n-m}|a_n+la_{n-1}$

### (B) Uma multiplicação interna tal que $k \in V$

1. k é um vertor arbitrário. $\\$
   Ex: $a_{n+1}=k\,a_n + la_{n-1}$
2. k é uma contração de resultado vetorial.$\\$
   Ex: $k=(a_n)^t\times a_{n-1}$
   Ex: $a_{n+1}=\left[(a_n)^t\times a_{n-1}\right]a_n + la_{n-1}$

### Total de testes por Espaço

$\#(A)\\
=\#(A:1)+\#(A:2)\\
=r+\left[\#(A:2.1)+\#(A:2.2)+\#(A:2.3)\right]\\
=r+\left[2\#(A:2.1)+\#(A:2.3)\right]\\
=r+2\left[\#(A:2.1.1)+\#(A:2.1.2)\right]+\#(A:2.3)\\
= r+2[r+3]+3 = 3(r+3)$

$\#(B)\\=\#(B:1)\\=r$

$\#(A+B)\\=\#(A)+\#(B)\\=3(r+3)+r\\=4r+9$

Como os testes são para $k a_n$ e para $l a_{n-1}$, separadamente, então o total é:

$\left[\#(A+B)\right]^2\\=[4r+9]^2\\=16r^2+72r+81$

Considerando o número de testes aleatórios, $r$, como em torno de $20$, teremos $[16r^2+72r+81]\circ 20=[20^2 16+72\cdot 20+81] = 7921$ testes por Espaço Vetorial $V$.

## Testar para

1. $\mathbb{R}, \mathbb{C}, \mathbb{D}, \mathbb{H}$
2. $\mathbb{V}^n\circ Q\;\forall\,Q\in\{\mathbb{R}, \mathbb{C}\}, n\in 2..4$
3. $\mathbb{V}^2\circ\mathbb{H}$
4. $\mathbb{R}^{|n; n|} = M_{n\times n}\circ\mathbb{R}, \mathbb{C}^{|n; n|}\forall n\in \{2; 3\}$

R, C, H, D,

V² ∘ R, V² ∘ C, V² ∘ H,

V³ ∘ R, V³ ∘ C,

R^{|2; 2|}, R^{|3; 3|}, C^{|2; 2|}, C^{|3; 3|}

1. Os conjuntos escalares devem ser autossuficientes / fechados para as seguintes operações:
   1. $a+b, -a, a-b$
   2. $a b, a^2$
   3. $a^-, \dfrac{a}{b}$
   4. $\sqrt{\displaystyle\sum_i a_i^2}$
2. Os conjuntos vetoriais devem ser autossuficientes / fechados para as seguintes operações:
   1. $a+b, -a, a-b$
   2. $ka, a\cdot b, |a|, \hat{a} = \dfrac{a}{|a|}$

```javascript
Scalar.[plus, negate, minus, times, inverse, div, join, toString, _calc_polar, toFixed]()
Scalar.[a, b]
Scalar.{hasPolar, LENGTH}
Scalar.{random}()

V.[plus, negate, minus, scale, dot, versor, join, toString, _calc_polar, toFixed]()
V.{LENGTH, ZERO, ONE, MINUS_ONE}
V.{random}()
```
