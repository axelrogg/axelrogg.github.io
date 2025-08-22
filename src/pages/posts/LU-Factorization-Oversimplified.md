---
layout: ../../layouts/PostLayout.astro
title: LU Factorization Oversimplified
description: An oversimplification of a technique to solve systems of linear equations
created_at: 2024-07-27
last_updated_at: 2024-12-28
tags: [circuit-simulation, code]
---

# Introduction

In the pursuit of building a circuit simulator from scratch, I came upon a
technique called LU factorization to solve systems of linear equations. If it's
not clear yet, being able to find solutions to these systems is a crucial task
in engineering. In this article, I will try to explain the main aspects of it
and a way to implement a simplified algorithm in C. The careful reader will
notice that I make plenty of statements without providing their mathematical
proofs. I will also make plenty of assumptions when implementing the
algorithms. Finally, you will find that these implementations are very *naïve*.
The reason for all of this is that I just found out about LU factorization, so
I haven't delved that deep into it--yet. Baby steps.

# My Personal Motivation

A couple of months ago, I decided that I was going to build an electric circuit
simulator. After trying an old circuit simulator called Micro-Cap for an
Introduction to Electronics class, I was intrigued by the inner workings of
simulators. In fact, I started to wonder about simulations in a Fluid Mechanics
class, but Fluid Mechanics was so challenging that I developed a certain degree
of PTSD towards it. Maybe someday I will return to that, but for now, I will
only focus on electric circuits. As an electrical engineering student, it suits
me better.

# Systems of Linear Equations

A lot of things are involved in any circuit simulator, even the rudimentary
ones.  There are many algorithms that perform different tasks, and a critical
one is an algorithm to solve systems of linear equations. The reason is that
many electric  circuits are linear in nature because of the linear
relationships between the output of the circuit elements, such as resistors,
and their input. Even when  components are not linear (diodes, transistors, and
more), their output-to-input relationship is *simplified* by creating linear
models that allow engineers to be able to treat those elements as linear, even
if they are not in reality. I won't dive into the reasons why linear
relationships are crucial in electric circuit analysis, but they are a big
deal. Many analysis techniques rely on  this. Engineers love simplicity (even
artificial simplicity). Now that we know how important it is to solve these
systems let's talk about the how.

# LU Factorization

For those of us who have taken a basic Linear Algebra class, there are two main
systematic ways to manually solve a system (Gaussian Elimination and Cramer's
rule). However, what's the best approach to solve a system using a computer?
That's where LU factorization comes into play. LU decomposition or
factorization is a technique that allows us to factor an $n \times n$
non-singular matrix $A$ as the product of two matrices $L$ and $U$. We can
express this with the following matrix equation.

$$
\tag{1}
A = LU
$$

where $L$ is a non-singular lower triangular $n \times n$ matrix and $U$ is an
upper triangular $n \times n$ non-singular matrix. Or,

$$
\tag{2}
A = LU =
\begin{bmatrix}
    l_{11} & 0      & 0      & \cdots & 0      \\
    l_{21} & l_{22} & 0      & \cdots & 0      \\
    \vdots & \vdots & \ddots & \vdots & \vdots \\
    l_{n1} & l_{n2} & l_{n3} & \cdots & l_{nn} \\
\end{bmatrix}
\begin{bmatrix}
   u_{11} & u_{12} & u_{13} & \cdots & u_{1n} \\
   0      & u_{22} & u_{23} & \cdots & u_{2n} \\
   \vdots & \vdots & \ddots & \vdots & \vdots \\
   0      & 0      & 0      & \cdots & u_{nn} \\
\end{bmatrix}
$$

This is the first moment in this article where I make a big claim like Eq. 1
without proving it. How do we know that $A$ can be factored into $L$ and $U$?
Are $L$ and $U$ unique for a given matrix $A$? Unfortunately, I do not know
yet.

Assuming that the previous statements are true, how does finding $L$ and $U$
gets us closer to our goal of solving systems of equations? Let's think about
this from the beginning. Let's start with the equation

$$
\tag{3}
A { \bf x } = { \bf b }
$$

By Eq. 2, we can see that

$$
\tag{4}
LU {\bf x} = {\bf b}
$$

Let $\bf y$ be a vector such that $U {\bf x } = {\bf y}$. It follows that

$$
\tag{5}
L { \bf y } = { \bf b }
$$

This means that to solve our original equation $A { \bf x } = { \bf b }$ we
first need to factor $A$ into $LU$. Then, solve Eq. 5, and finally solve
$U { \bf x } = { \bf y }$. That's it.

We can summarize the entire process in three steps:

1.  $LU$ factorization.
2.  Forward substitution (solving the equation $L { \bf y } = { \bf b }$).
3.  Backward substitution (solving the equation $U { \bf x } = { \bf y }$).

# How to Factorize $A$?
There are a few ways to do this as far as I know, but the one we will cover
here is Crout's algorithm (for no particular reason, other than the fact that I
read about it first). The version of this algorithm I will explain assumes that
no pivoting is required to find a solution. The pivoting process is out of the
scope of this article because I want to keep it simple, but the TL;DR is that
sometimes we need to rearrange the rows and/or columns of a matrix at a certain
point to be able to find a solution.

## Deriving Crout's algorithm

First let's see what the problem at hand looks like.

$$
\tag{6}
\begin{bmatrix}
    l_{11} & 0      & 0      & \cdots & 0      \\
    l_{21} & l_{22} & 0      & \cdots & 0      \\
    \vdots & \vdots & \ddots & \vdots & \vdots \\
    l_{n1} & l_{n2} & l_{n3} & \cdots & l_{nn} \\
\end{bmatrix}
\begin{bmatrix}
   u_{11} & u_{12} & u_{13} & \cdots & u_{1n} \\
   0      & u_{22} & u_{23} & \cdots & u_{2n} \\
   \vdots & \vdots & \ddots & \vdots & \vdots \\
   0      & 0      & 0      & \cdots & u_{nn} \\
\end{bmatrix}
=
\begin{bmatrix}
   a_{11} & a_{12} & \cdots & a_{1n} \\
   a_{21} & a_{22} & \cdots & a_{2n} \\
   \vdots & \vdots & \ddots & \vdots \\
   a_{n1} & a_{n2} & \cdots & a_{nn} \\
\end{bmatrix}
$$

Because these are all $n \times n$ matrices, we have $n^2$ equations. How many
unknowns do we have? First, remember that every $l_{ij}$ and $u_{ik}$ are
unknowns and $a_{ij}$ are all well known constants. Now let's focus on the
columns of $L$. If we start from the rightmost column, we can see that we only
have one unknown, namely $l_{nn}$. As we move towards the leftmost column, we
will find one more unknown for every new column we encounter. This can be
expressed simply by the following relationship.

$$
\tag{7}
\text{Total number of unknowns in } L = \sum_{j=1}^{n}j = \frac{n(n + 1)}{2}
$$

Similarly, we have that

$$
\tag{8}
\text{Total number of unknowns in } U = \sum_{j=1}^{n}j = \frac{n(n + 1)}{2}
$$

Therefore, the total number of unknowns in Eq. 6 is

$$
\tag{9}
\frac{n(n + 1)}{2} + \frac{n(n + 1)}{2} = n^2 + n
$$

We have $n$ more unknowns than equations. Crout's algorithm mitigates this
problem by setting all diagonal elements of $U$ to $1$. One could choose a
value other than $1$ as long as it's not $0$, but as you will see, choosing $1$
reduces our computational effort. With this in mind, Eq. 6 now looks like this:

$$
\tag{10}
\begin{bmatrix}
    l_{11} & 0      & 0      & \cdots & 0      \\
    l_{21} & l_{22} & 0      & \cdots & 0      \\
    \vdots & \vdots & \ddots & \vdots & \vdots \\
    l_{n1} & l_{n2} & l_{n3} & \cdots & l_{nn} \\
\end{bmatrix}
\begin{bmatrix}
   1      & u_{12} & u_{13} & \cdots & u_{1n} \\
   0      & 1      & u_{23} & \cdots & u_{2n} \\
   \vdots & \vdots & \ddots & \vdots & \vdots \\
   0      & 0      & 0      & \cdots & 1 \\
\end{bmatrix}
=
\begin{bmatrix}
   a_{11} & a_{12} & \cdots & a_{1n} \\
   a_{21} & a_{22} & \cdots & a_{2n} \\
   \vdots & \vdots & \ddots & \vdots \\
   a_{n1} & a_{n2} & \cdots & a_{nn} \\
\end{bmatrix}
$$

If we perform the matrix multiplication from the equation above, then $A$
becomes

$$
A =
\begin{bmatrix}
    l_{11} & l_{11} \, u_{12}          & l_{11} \, u_{13}      & \cdots  \\
    l_{21} & l_{21} \, u_{12} + l_{22} & l_{21} \, u_{13} + l_{22} \, u_{23}      & \cdots  \\
    l_{31} & l_{31} \, u_{12} + l_{32} & l_{31} \, u_{13} + l_{32} \, u_{23} + l_{33} & \cdots  \\
    l_{41} & l_{41} \, u_{12} + l_{42} & l_{41} \, u_{13} + l_{42} \, u_{23} + l_{43} & \cdots  \\
    \vdots & \vdots                    & \vdots & \ddots  \\
\end{bmatrix}
$$

Can you notice any patterns? First, if we focus our attention on the first
column of $A$ it's clear that

$$
\tag{11}
l_{i1} = a_{i1}, \ \ \ \ \ \ \forall i \ge 1
$$

Now let's look at the first row of $A$. Once we know $l_{11}$, we can see that
for all $j \ge 2$:

$$
\tag{12}
u_{1j} = \frac{a_{1j}}{l_{11}}
$$

We have solved the first column of $L$ and the first row of $U$. Great start!
Can we discern more patterns? Let's consider the second column and row of $A$.
For all $i \ge 2$:

$$
\tag{13}
l_{i2} = a_{i2} - l_{i1} \, u_{12}
$$

and, for the second row, since $l_{21}$ and $u_{1j}$ are known, then for all
$j \ge 3$:

$$
u_{2j} = \frac{a_{2j} - l_{21} \, u_{1j}}{l_{22}}
$$

Time to generalize. For a given column $k$,

$$
\tag{14}
l_{ik} = a_{ik} - \sum_{t = 1}^{k-1} l_{ik} \, u_{tk}, \ \ \ \ \ \forall i \ge k
$$

and for a given row $k$,

$$
\tag{15}
u_{kj} = \bigg( a_{kj} - \sum_{t = 1}^{k-1} l_{kt} \, u_{tj}\bigg) \bigg/ l_{kk}, \ \ \ \ \ \forall j \ge k + 1
$$

Notice two things from Eqs. 14 and 15:
*   $u_{ii}
$ is nowhere to be found. This is because the value was already known to be $1
$.
*   We can alternate between column and row computations.

There is one more thing until we see some code. We don't have to store $L$ and
$U$ separately in memory. We can create one matrix $S = L + U - I$, where $I$
is an $n \times n$ identity matrix.

We can now see what the code looks like:

```c
for (int k = 0; k < n; k++) {
    for (int i = k; i < n; i++) {
        float sum = 0;
        for (int t = 0; t < k; t++) {
            sum += S[i][t] * S[t][k];
        }
        S[i][k] = matrix[i][k] - sum;
    }
    for (int j = k + 1; j < n; j++) {
        float sum = 0;
        for (int t = 0; t < k; t++) {
            sum += S[k][t] * S[t][j];
        }
        S[k][j] = (matrix[k][j] - sum) / S[k][k];
    }
}
```

# Forward Substitution

As I mentioned earlier, the forward substitution process is concerned with
solving the system $L { \bf y } = { \bf b }$, which looks like this:

$$
\begin{bmatrix}
    l_{11} & 0      & 0      & \cdots & 0 \\
    l_{21} & l_{22} & 0      & \cdots & 0 \\
    \vdots & \vdots & \ddots & \vdots & \\
    l_{n1} & l_{n2} & l_{n3} & \cdots & l_{nn} \\
\end{bmatrix}
\begin{bmatrix}
    y_{1} \\
    y_{2} \\
    \vdots \\
    y_{n} \\
\end{bmatrix}
=
\begin{bmatrix}
    b_{1} \\
    b_{2} \\
    \vdots \\
    b_{n} \\
\end{bmatrix}
$$

This is what makes LU factorization a great way to solve systems of linear
equations. Once we have both $L$ and $U$, we have to solve twice the number of
systems, but because they are triangular, finding a solution is much faster.

Let's start by finding the easiest value, $y_1$. It is clear that the following
equation is true.

$$
\tag{16}
y_1 = \frac{b_1}{l_{11}}.
$$

Next is $y_2$.

$$
\tag{17}
y_2 = \frac{b_2 - y_1 \, l_{21} }{l_{22}}
$$

We can generalize this for any value of $\bf y$.

$$
\tag{18}
y_j = \frac{b_j - \sum_{k=1}^{j-1} l_{jk} \, y_k}{l_{jj}}
$$

for all $j = 1, \dots, n$.

Let's take a look the code.

```c
// `y` might've come from a function argument or from a `malloc` call.
// Remember that `y` must have enough space for `n` elements.
for (int j = 0; j < n; j++) {
    float sum = 0;
    for (int k = 0; k < j + 1; k++) {
        sum += matrix[j][k] * y[k];
    }
    y[j] = (b[j] - sum) / matrix[j][j];
}
```

This is a very straightforward implementation of Eq. 18. It works well enough
for the current purpose.

Now, on to the last step.


# Backward substitution

Backward substitution is very similar to the previous algorithm. The system we
need to solve is now $U {\bf x} = {\bf y}$. Remember that because we use
Crout's algorithm to find $L$ and $U$, the elements on the diagonal of $U$ are
all $1$s.

$$
\begin{bmatrix}
   1      & u_{12} & u_{13} & \cdots & u_{1n} \\
   0      & 1      & u_{23} & \cdots & u_{2n} \\
   \vdots & \vdots & \ddots & \vdots &        \\
   0      & 0      & 0      & \cdots & 1      \\
\end{bmatrix}
\begin{bmatrix}
    x_{1} \\
    x_{2} \\
    \vdots \\
    x_{n} \\
\end{bmatrix}
=
\begin{bmatrix}
    y_{1} \\
    y_{2} \\
    \vdots \\
    y_{n} \\
\end{bmatrix}
$$

We can skip the first couple of values, and only look at the general equation
for any element of $\bf x$:

$$
\tag{19}
x_j = \frac{y_j - \sum_{k=j + 1}^{n} u_{jk} \, x_k}{u_{jj}}
$$

Since $u_{jj}$ is always $1$ for all valid values of $j$, we can simplify this
by the following relationship.

$$
\tag{20}
x_j = y_j - \sum_{k=j + 1}^{n} u_{jk} \, x_k
$$

You can see the code below.

```c
// Let's assume that `x` was defined earlier.
for (int j = n - 1; j > n; j--) {
    float sum = 0;
    for (int k = j + 1; k < n; k++) {
        sum += matrix[j][k] * x[k];
    }
    // No division needed here because Crout's algorithm sets all elements
    // of the diagonal of U to 1.
    x[j] = y[j] - sum;
}
```

# Conclusion

This article was meant to condense all the ideas I've been dealing with for the
past week. Najm's *Circuit Simulation* book has been an absolute treat to read
and cannot recommend it enough for people who want to get into circuit
simulations or simulations in general. It does contain theorems that justify
many of ideas behind their approach to solving problems, but it focuses more on
implementations and less on being rigorous. That's the book I'm reading right
now and where I found 99% of the information used here.

# References

1.  F. N. Najm, Circuit simulation. Hoboken, N.J.: Wiley, 2010.
2.  D. C. Lay, S. R. Lay, and J. Mcdonald, Linear algebra and its applications.

