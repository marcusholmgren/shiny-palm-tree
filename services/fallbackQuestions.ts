import {Difficulty, QuizQuestion} from '../types';

export const FALLBACK_QUESTIONS: Record<string, Record<Difficulty, QuizQuestion[]>> = {
    naive_def: {
        easy: [
            {
                question: "A bag contains 3 red balls and 2 blue balls. If you draw one ball at random, what is the probability it is red?",
                options: ["$\\frac{1}{5}$", "$\\frac{2}{5}$", "$\\frac{3}{5}$", "$\\frac{3}{2}$"],
                correctIndex: 2,
                explanation: "By the naive definition of probability, $P(A) = \\frac{|A|}{|S|}$ when all outcomes are equally likely. There are 3 red balls out of 5 total balls, so $P(\\text{red}) = \\frac{3}{5}$.",
            },
            {
                question: "A bag contains 4 red balls and 3 blue balls. If you draw one ball at random, what is the probability it is red?",
                options: ["$\\frac{1}{7}$", "$\\frac{3}{7}$", "$\\frac{4}{7}$", "$\\frac{4}{3}$"],
                correctIndex: 2,
                explanation: "By the naive definition of probability, $P(A) = \\frac{|A|}{|S|}$ when all outcomes are equally likely. There are 4 red balls out of 7 total balls, so $P(\\text{red}) = \\frac{4}{7}$.",
            },
            {
                question: "A bag contains 5 red balls and 2 blue balls. If you draw one ball at random, what is the probability it is red?",
                options: ["$\\frac{1}{7}$", "$\\frac{2}{7}$", "$\\frac{5}{7}$", "$\\frac{5}{2}$"],
                correctIndex: 2,
                explanation: "By the naive definition of probability, $P(A) = \\frac{|A|}{|S|}$ when all outcomes are equally likely. There are 5 red balls out of 7 total balls, so $P(\\text{red}) = \\frac{5}{7}$.",
            },
            {
                question: "A bag contains 2 red balls and 7 blue balls. If you draw one ball at random, what is the probability it is red?",
                options: ["$\\frac{1}{9}$", "$\\frac{7}{9}$", "$\\frac{2}{9}$", "$\\frac{2}{7}$"],
                correctIndex: 2,
                explanation: "By the naive definition of probability, $P(A) = \\frac{|A|}{|S|}$ when all outcomes are equally likely. There are 2 red balls out of 9 total balls, so $P(\\text{red}) = \\frac{2}{9}$.",
            },
            {
                question: "A bag contains 6 red balls and 1 blue balls. If you draw one ball at random, what is the probability it is red?",
                options: ["$\\frac{1}{7}$", "$\\frac{1}{7}$", "$\\frac{6}{7}$", "$\\frac{6}{1}$"],
                correctIndex: 2,
                explanation: "By the naive definition of probability, $P(A) = \\frac{|A|}{|S|}$ when all outcomes are equally likely. There are 6 red balls out of 7 total balls, so $P(\\text{red}) = \\frac{6}{7}$.",
            },
        ],
        medium: [
            {
                question: "If you roll two fair 6-sided dice, what is the probability that the sum of the numbers rolled is exactly 7?",
                options: ["$\\frac{1}{6}$", "$\\frac{1}{12}$", "$\\frac{6}{36}$", "$\\frac{1}{9}$"],
                correctIndex: 2,
                explanation: "The sample space size is $6 \\times 6 = 36$. The successful outcomes for a sum of 7 are 6 in number. Thus, $P(\\text{sum is 7}) = \\frac{6}{36}$.",
            },
            {
                question: "If you roll two fair 6-sided dice, what is the probability that the sum of the numbers rolled is exactly 4?",
                options: ["$\\frac{1}{6}$", "$\\frac{1}{12}$", "$\\frac{3}{36}$", "$\\frac{1}{9}$"],
                correctIndex: 2,
                explanation: "The sample space size is $6 \\times 6 = 36$. The successful outcomes for a sum of 4 are 3 in number. Thus, $P(\\text{sum is 4}) = \\frac{3}{36}$.",
            },
            {
                question: "If you roll two fair 6-sided dice, what is the probability that the sum of the numbers rolled is exactly 9?",
                options: ["$\\frac{1}{6}$", "$\\frac{1}{12}$", "$\\frac{4}{36}$", "$\\frac{1}{9}$"],
                correctIndex: 2,
                explanation: "The sample space size is $6 \\times 6 = 36$. The successful outcomes for a sum of 9 are 4 in number. Thus, $P(\\text{sum is 9}) = \\frac{4}{36}$.",
            },
            {
                question: "If you roll two fair 6-sided dice, what is the probability that the sum of the numbers rolled is exactly 10?",
                options: ["$\\frac{1}{6}$", "$\\frac{1}{12}$", "$\\frac{3}{36}$", "$\\frac{1}{9}$"],
                correctIndex: 2,
                explanation: "The sample space size is $6 \\times 6 = 36$. The successful outcomes for a sum of 10 are 3 in number. Thus, $P(\\text{sum is 10}) = \\frac{3}{36}$.",
            },
            {
                question: "If you roll two fair 6-sided dice, what is the probability that the sum of the numbers rolled is exactly 11?",
                options: ["$\\frac{1}{6}$", "$\\frac{1}{12}$", "$\\frac{2}{36}$", "$\\frac{1}{9}$"],
                correctIndex: 2,
                explanation: "The sample space size is $6 \\times 6 = 36$. The successful outcomes for a sum of 11 are 2 in number. Thus, $P(\\text{sum is 11}) = \\frac{2}{36}$.",
            },
        ],
        hard: [
            {
                question: "A fair coin is flipped 10 times. What is the probability of getting exactly 5 heads?",
                options: ["$\\frac{1}{2}$", "$\\frac{1}{10}$", "$\\frac{252}{1024}$", "$\\frac{5}{10}$"],
                correctIndex: 2,
                explanation: "There are $2^{10} = 1024$ equally likely outcomes. The number of outcomes with exactly 5 heads is given by the combinations formula $\\binom{10}{5} = 252$. The probability is $\\frac{252}{1024}$.",
            },
            {
                question: "A fair coin is flipped 10 times. What is the probability of getting exactly 4 heads?",
                options: ["$\\frac{1}{2}$", "$\\frac{1}{10}$", "$\\frac{210}{1024}$", "$\\frac{4}{10}$"],
                correctIndex: 2,
                explanation: "There are $2^{10} = 1024$ equally likely outcomes. The number of outcomes with exactly 4 heads is given by the combinations formula $\\binom{10}{4} = 210$. The probability is $\\frac{210}{1024}$.",
            },
            {
                question: "A fair coin is flipped 10 times. What is the probability of getting exactly 6 heads?",
                options: ["$\\frac{1}{2}$", "$\\frac{1}{10}$", "$\\frac{210}{1024}$", "$\\frac{6}{10}$"],
                correctIndex: 2,
                explanation: "There are $2^{10} = 1024$ equally likely outcomes. The number of outcomes with exactly 6 heads is given by the combinations formula $\\binom{10}{6} = 210$. The probability is $\\frac{210}{1024}$.",
            },
            {
                question: "A fair coin is flipped 10 times. What is the probability of getting exactly 3 heads?",
                options: ["$\\frac{1}{2}$", "$\\frac{1}{10}$", "$\\frac{120}{1024}$", "$\\frac{3}{10}$"],
                correctIndex: 2,
                explanation: "There are $2^{10} = 1024$ equally likely outcomes. The number of outcomes with exactly 3 heads is given by the combinations formula $\\binom{10}{3} = 120$. The probability is $\\frac{120}{1024}$.",
            },
            {
                question: "A fair coin is flipped 10 times. What is the probability of getting exactly 7 heads?",
                options: ["$\\frac{1}{2}$", "$\\frac{1}{10}$", "$\\frac{120}{1024}$", "$\\frac{7}{10}$"],
                correctIndex: 2,
                explanation: "There are $2^{10} = 1024$ equally likely outcomes. The number of outcomes with exactly 7 heads is given by the combinations formula $\\binom{10}{7} = 120$. The probability is $\\frac{120}{1024}$.",
            },
        ],
    },
    multiplication: {
        easy: [
            {
                question: "A restaurant offers a lunch combo with a choice of 3 sandwiches, 2 sides, and 4 drinks. How many unique combinations can you make?",
                options: ["24", "9", "10", "11"],
                correctIndex: 0,
                explanation: "By the multiplication rule, if there are sequential independent choices, the total number of combinations is the product of the number of choices at each stage: $3 \\times 2 \\times 4 = 24$.",
            },
            {
                question: "A restaurant offers a lunch combo with a choice of 2 sandwiches, 3 sides, and 3 drinks. How many unique combinations can you make?",
                options: ["18", "8", "9", "11"],
                correctIndex: 0,
                explanation: "By the multiplication rule, if there are sequential independent choices, the total number of combinations is the product of the number of choices at each stage: $2 \\times 3 \\times 3 = 18$.",
            },
            {
                question: "A restaurant offers a lunch combo with a choice of 4 sandwiches, 2 sides, and 2 drinks. How many unique combinations can you make?",
                options: ["16", "8", "10", "8"],
                correctIndex: 0,
                explanation: "By the multiplication rule, if there are sequential independent choices, the total number of combinations is the product of the number of choices at each stage: $4 \\times 2 \\times 2 = 16$.",
            },
            {
                question: "A restaurant offers a lunch combo with a choice of 3 sandwiches, 3 sides, and 3 drinks. How many unique combinations can you make?",
                options: ["27", "9", "12", "12"],
                correctIndex: 0,
                explanation: "By the multiplication rule, if there are sequential independent choices, the total number of combinations is the product of the number of choices at each stage: $3 \\times 3 \\times 3 = 27$.",
            },
            {
                question: "A restaurant offers a lunch combo with a choice of 5 sandwiches, 2 sides, and 3 drinks. How many unique combinations can you make?",
                options: ["30", "10", "13", "11"],
                correctIndex: 0,
                explanation: "By the multiplication rule, if there are sequential independent choices, the total number of combinations is the product of the number of choices at each stage: $5 \\times 2 \\times 3 = 30$.",
            },
        ],
        medium: [
            {
                question: "A standard license plate consists of 3 uppercase letters (A-Z) followed by 3 digits (0-9). If repetition is allowed, how many unique license plates are possible?",
                options: ["17576000", "2340", "$26^{3} \\times 10^{3}$", "$26 \\times 25 \\times 10 \\times 9$"],
                correctIndex: 0,
                explanation: "There are 26 choices for each of the 3 letter positions, and 10 choices for each of the 3 digit positions. By the multiplication rule, the total number of unique plates is $26^{3} \\times 10^{3}$.",
            },
            {
                question: "A standard license plate consists of 2 uppercase letters (A-Z) followed by 4 digits (0-9). If repetition is allowed, how many unique license plates are possible?",
                options: ["6760000", "2080", "$26^{2} \\times 10^{4}$", "$26 \\times 25 \\times 10 \\times 9$"],
                correctIndex: 0,
                explanation: "There are 26 choices for each of the 2 letter positions, and 10 choices for each of the 4 digit positions. By the multiplication rule, the total number of unique plates is $26^{2} \\times 10^{4}$.",
            },
            {
                question: "A standard license plate consists of 4 uppercase letters (A-Z) followed by 2 digits (0-9). If repetition is allowed, how many unique license plates are possible?",
                options: ["45697600", "2080", "$26^{4} \\times 10^{2}$", "$26 \\times 25 \\times 10 \\times 9$"],
                correctIndex: 0,
                explanation: "There are 26 choices for each of the 4 letter positions, and 10 choices for each of the 2 digit positions. By the multiplication rule, the total number of unique plates is $26^{4} \\times 10^{2}$.",
            },
            {
                question: "A standard license plate consists of 3 uppercase letters (A-Z) followed by 2 digits (0-9). If repetition is allowed, how many unique license plates are possible?",
                options: ["1757600", "1560", "$26^{3} \\times 10^{2}$", "$26 \\times 25 \\times 10 \\times 9$"],
                correctIndex: 0,
                explanation: "There are 26 choices for each of the 3 letter positions, and 10 choices for each of the 2 digit positions. By the multiplication rule, the total number of unique plates is $26^{3} \\times 10^{2}$.",
            },
            {
                question: "A standard license plate consists of 2 uppercase letters (A-Z) followed by 3 digits (0-9). If repetition is allowed, how many unique license plates are possible?",
                options: ["676000", "1560", "$26^{2} \\times 10^{3}$", "$26 \\times 25 \\times 10 \\times 9$"],
                correctIndex: 0,
                explanation: "There are 26 choices for each of the 2 letter positions, and 10 choices for each of the 3 digit positions. By the multiplication rule, the total number of unique plates is $26^{2} \\times 10^{3}$.",
            },
        ],
        hard: [
            {
                question: "You are creating a 4-character password. It must start with one of 2 vowels, end with one of 4 consonants, and the middle two characters can be any of 6 letters. Repetition is allowed. How many passwords can be formed?",
                options: ["288", "18", "48", "240"],
                correctIndex: 0,
                explanation: "The first position has 2 choices. The last has 4 choices. The middle two have 6 choices each. By the multiplication rule, the total is $2 \\times 6 \\times 6 \\times 4 = 288$.",
            },
            {
                question: "You are creating a 4-character password. It must start with one of 3 vowels, end with one of 3 consonants, and the middle two characters can be any of 6 letters. Repetition is allowed. How many passwords can be formed?",
                options: ["324", "18", "54", "270"],
                correctIndex: 0,
                explanation: "The first position has 3 choices. The last has 3 choices. The middle two have 6 choices each. By the multiplication rule, the total is $3 \\times 6 \\times 6 \\times 3 = 324$.",
            },
            {
                question: "You are creating a 4-character password. It must start with one of 1 vowels, end with one of 5 consonants, and the middle two characters can be any of 6 letters. Repetition is allowed. How many passwords can be formed?",
                options: ["180", "18", "30", "150"],
                correctIndex: 0,
                explanation: "The first position has 1 choices. The last has 5 choices. The middle two have 6 choices each. By the multiplication rule, the total is $1 \\times 6 \\times 6 \\times 5 = 180$.",
            },
            {
                question: "You are creating a 4-character password. It must start with one of 2 vowels, end with one of 5 consonants, and the middle two characters can be any of 7 letters. Repetition is allowed. How many passwords can be formed?",
                options: ["490", "21", "70", "420"],
                correctIndex: 0,
                explanation: "The first position has 2 choices. The last has 5 choices. The middle two have 7 choices each. By the multiplication rule, the total is $2 \\times 7 \\times 7 \\times 5 = 490$.",
            },
            {
                question: "You are creating a 4-character password. It must start with one of 3 vowels, end with one of 4 consonants, and the middle two characters can be any of 7 letters. Repetition is allowed. How many passwords can be formed?",
                options: ["588", "21", "84", "504"],
                correctIndex: 0,
                explanation: "The first position has 3 choices. The last has 4 choices. The middle two have 7 choices each. By the multiplication rule, the total is $3 \\times 7 \\times 7 \\times 4 = 588$.",
            },
        ],
    },
    sampling_table: {
        easy: [
            {
                question: "In a race with 8 runners, in how many ways can the top 3 medals be awarded?",
                options: ["336", "24", "512", "120"],
                correctIndex: 0,
                explanation: "Since the medals are distinct, order matters. Runners cannot get multiple medals. Applying the formula for ordered sampling without replacement: $P(8, 3) = 336$.",
            },
            {
                question: "In a race with 10 runners, in how many ways can the top 3 medals be awarded?",
                options: ["720", "30", "1000", "120"],
                correctIndex: 0,
                explanation: "Since the medals are distinct, order matters. Runners cannot get multiple medals. Applying the formula for ordered sampling without replacement: $P(10, 3) = 720$.",
            },
            {
                question: "In a race with 6 runners, in how many ways can the top 3 medals be awarded?",
                options: ["120", "18", "216", "120"],
                correctIndex: 0,
                explanation: "Since the medals are distinct, order matters. Runners cannot get multiple medals. Applying the formula for ordered sampling without replacement: $P(6, 3) = 120$.",
            },
            {
                question: "In a race with 7 runners, in how many ways can the top 3 medals be awarded?",
                options: ["210", "21", "343", "120"],
                correctIndex: 0,
                explanation: "Since the medals are distinct, order matters. Runners cannot get multiple medals. Applying the formula for ordered sampling without replacement: $P(7, 3) = 210$.",
            },
            {
                question: "In a race with 9 runners, in how many ways can the top 3 medals be awarded?",
                options: ["504", "27", "729", "120"],
                correctIndex: 0,
                explanation: "Since the medals are distinct, order matters. Runners cannot get multiple medals. Applying the formula for ordered sampling without replacement: $P(9, 3) = 504$.",
            },
        ],
        medium: [
            {
                question: "In how many ways can we choose 3 scoops of ice cream from 5 flavors if order doesn't matter and repetition is allowed?",
                options: ["35", "15", "125", "10"],
                correctIndex: 0,
                explanation: "Since order doesn't matter and repetition is allowed, this is unordered sampling with replacement. Applying the stars and bars formula $\\binom{5+3-1}{3}$ gives $\\binom{7}{3} = 35$.",
            },
            {
                question: "In how many ways can we choose 4 scoops of ice cream from 4 flavors if order doesn't matter and repetition is allowed?",
                options: ["35", "16", "256", "1"],
                correctIndex: 0,
                explanation: "Since order doesn't matter and repetition is allowed, this is unordered sampling with replacement. Applying the stars and bars formula $\\binom{4+4-1}{4}$ gives $\\binom{7}{4} = 35$.",
            },
            {
                question: "In how many ways can we choose 2 scoops of ice cream from 6 flavors if order doesn't matter and repetition is allowed?",
                options: ["21", "12", "36", "15"],
                correctIndex: 0,
                explanation: "Since order doesn't matter and repetition is allowed, this is unordered sampling with replacement. Applying the stars and bars formula $\\binom{6+2-1}{2}$ gives $\\binom{7}{2} = 21$.",
            },
            {
                question: "In how many ways can we choose 5 scoops of ice cream from 3 flavors if order doesn't matter and repetition is allowed?",
                options: ["21", "15", "243", "0"],
                correctIndex: 0,
                explanation: "Since order doesn't matter and repetition is allowed, this is unordered sampling with replacement. Applying the stars and bars formula $\\binom{3+5-1}{5}$ gives $\\binom{7}{5} = 21$.",
            },
            {
                question: "In how many ways can we choose 4 scoops of ice cream from 5 flavors if order doesn't matter and repetition is allowed?",
                options: ["70", "20", "625", "5"],
                correctIndex: 0,
                explanation: "Since order doesn't matter and repetition is allowed, this is unordered sampling with replacement. Applying the stars and bars formula $\\binom{5+4-1}{4}$ gives $\\binom{8}{4} = 70$.",
            },
        ],
        hard: [
            {
                question: "A committee of 5 is chosen from a group of 10 people. If 2 specific people refuse to serve together, how many valid committees can be formed?",
                options: ["196", "252", "56", "196"],
                correctIndex: 0,
                explanation: "Total ways to choose 5 from 10 is $\\binom{10}{5} = 252$. The number of bad committees where both specific people serve together is choosing the remaining 3 members from the remaining 8: $\\binom{8}{3} = 56$. Valid committees = $252 - 56 = 196$.",
            },
            {
                question: "A committee of 5 is chosen from a group of 12 people. If 2 specific people refuse to serve together, how many valid committees can be formed?",
                options: ["672", "792", "120", "540"],
                correctIndex: 0,
                explanation: "Total ways to choose 5 from 12 is $\\binom{12}{5} = 792$. The number of bad committees where both specific people serve together is choosing the remaining 3 members from the remaining 10: $\\binom{10}{3} = 120$. Valid committees = $792 - 120 = 672$.",
            },
            {
                question: "A committee of 4 is chosen from a group of 11 people. If 2 specific people refuse to serve together, how many valid committees can be formed?",
                options: ["294", "330", "36", "204"],
                correctIndex: 0,
                explanation: "Total ways to choose 4 from 11 is $\\binom{11}{4} = 330$. The number of bad committees where both specific people serve together is choosing the remaining 2 members from the remaining 9: $\\binom{9}{2} = 36$. Valid committees = $330 - 36 = 294$.",
            },
            {
                question: "A committee of 4 is chosen from a group of 9 people. If 2 specific people refuse to serve together, how many valid committees can be formed?",
                options: ["105", "126", "21", "91"],
                correctIndex: 0,
                explanation: "Total ways to choose 4 from 9 is $\\binom{9}{4} = 126$. The number of bad committees where both specific people serve together is choosing the remaining 2 members from the remaining 7: $\\binom{7}{2} = 21$. Valid committees = $126 - 21 = 105$.",
            },
            {
                question: "A committee of 4 is chosen from a group of 10 people. If 2 specific people refuse to serve together, how many valid committees can be formed?",
                options: ["182", "210", "28", "140"],
                correctIndex: 0,
                explanation: "Total ways to choose 4 from 10 is $\\binom{10}{4} = 210$. The number of bad committees where both specific people serve together is choosing the remaining 2 members from the remaining 8: $\\binom{8}{2} = 28$. Valid committees = $210 - 28 = 182$.",
            },
        ],
    },
    story_proofs: {
        easy: [
            {
                question: "Which of the following describes the combinatorial story behind the identity $n \\times 2^{n-1} = \\sum_{k=1}^{n} k\\binom{n}{k}$? (Version 1)",
                options: [
                    "Choosing a committee of any size from $n$ people, with one designated leader.",
                    "Choosing a committee of size $k$ with one designated leader.",
                    "Choosing two disjoint committees from $n$ candidates.",
                    "Arranging $n$ people in a line with a captain."
                ],
                correctIndex: 0,
                explanation: "Both sides count the number of ways to choose a committee of any size from $n$ candidates, with one designated leader. The right side counts by casework on committee size $k$. The left side counts by picking the leader first ($n$ choices), then choosing whether each of the remaining $n-1$ people is on the committee ($2^{n-1}$ choices).",
            },
            {
                question: "Which of the following describes the combinatorial story behind the identity $n \\times 2^{n-1} = \\sum_{k=1}^{n} k\\binom{n}{k}$? (Version 2)",
                options: [
                    "Choosing a committee of any size from $n$ people, with one designated leader.",
                    "Choosing a committee of size $k$ with one designated leader.",
                    "Choosing two disjoint committees from $n$ candidates.",
                    "Arranging $n$ people in a line with a captain."
                ],
                correctIndex: 0,
                explanation: "Both sides count the number of ways to choose a committee of any size from $n$ candidates, with one designated leader. The right side counts by casework on committee size $k$. The left side counts by picking the leader first ($n$ choices), then choosing whether each of the remaining $n-1$ people is on the committee ($2^{n-1}$ choices).",
            },
            {
                question: "Which of the following describes the combinatorial story behind the identity $n \\times 2^{n-1} = \\sum_{k=1}^{n} k\\binom{n}{k}$? (Version 3)",
                options: [
                    "Choosing a committee of any size from $n$ people, with one designated leader.",
                    "Choosing a committee of size $k$ with one designated leader.",
                    "Choosing two disjoint committees from $n$ candidates.",
                    "Arranging $n$ people in a line with a captain."
                ],
                correctIndex: 0,
                explanation: "Both sides count the number of ways to choose a committee of any size from $n$ candidates, with one designated leader. The right side counts by casework on committee size $k$. The left side counts by picking the leader first ($n$ choices), then choosing whether each of the remaining $n-1$ people is on the committee ($2^{n-1}$ choices).",
            },
            {
                question: "Which of the following describes the combinatorial story behind the identity $n \\times 2^{n-1} = \\sum_{k=1}^{n} k\\binom{n}{k}$? (Version 4)",
                options: [
                    "Choosing a committee of any size from $n$ people, with one designated leader.",
                    "Choosing a committee of size $k$ with one designated leader.",
                    "Choosing two disjoint committees from $n$ candidates.",
                    "Arranging $n$ people in a line with a captain."
                ],
                correctIndex: 0,
                explanation: "Both sides count the number of ways to choose a committee of any size from $n$ candidates, with one designated leader. The right side counts by casework on committee size $k$. The left side counts by picking the leader first ($n$ choices), then choosing whether each of the remaining $n-1$ people is on the committee ($2^{n-1}$ choices).",
            },
            {
                question: "Which of the following describes the combinatorial story behind the identity $n \\times 2^{n-1} = \\sum_{k=1}^{n} k\\binom{n}{k}$? (Version 5)",
                options: [
                    "Choosing a committee of any size from $n$ people, with one designated leader.",
                    "Choosing a committee of size $k$ with one designated leader.",
                    "Choosing two disjoint committees from $n$ candidates.",
                    "Arranging $n$ people in a line with a captain."
                ],
                correctIndex: 0,
                explanation: "Both sides count the number of ways to choose a committee of any size from $n$ candidates, with one designated leader. The right side counts by casework on committee size $k$. The left side counts by picking the leader first ($n$ choices), then choosing whether each of the remaining $n-1$ people is on the committee ($2^{n-1}$ choices).",
            },
        ],
        medium: [
            {
                question: "Consider the identity $\\sum_{k=0}^{n} \\binom{n}{k}^2 = \\binom{2n}{n}$. What is the standard story proof for this identity (Vandermonde's Identity)? (Version 1)",
                options: [
                    "Choosing a committee of size $n$ from a group of $n$ men and $n$ women.",
                    "Choosing a committee of size $k$ from $2n$ candidates.",
                    "Arranging $2n$ people in two separate rows.",
                    "Choosing $n$ items with replacement from $n$ options."
                ],
                correctIndex: 0,
                explanation: "The right side is the number of ways to choose $n$ people from $2n$ total candidates. The left side counts the same by grouping by how many men are chosen ($k$). If we choose $k$ men, we must choose $n-k$ women. The ways to do this is $\\binom{n}{k}\\binom{n}{n-k} = \\binom{n}{k}^2$ by symmetry, summing over all possible $k$.",
            },
            {
                question: "Consider the identity $\\sum_{k=0}^{n} \\binom{n}{k}^2 = \\binom{2n}{n}$. What is the standard story proof for this identity (Vandermonde's Identity)? (Version 2)",
                options: [
                    "Choosing a committee of size $n$ from a group of $n$ men and $n$ women.",
                    "Choosing a committee of size $k$ from $2n$ candidates.",
                    "Arranging $2n$ people in two separate rows.",
                    "Choosing $n$ items with replacement from $n$ options."
                ],
                correctIndex: 0,
                explanation: "The right side is the number of ways to choose $n$ people from $2n$ total candidates. The left side counts the same by grouping by how many men are chosen ($k$). If we choose $k$ men, we must choose $n-k$ women. The ways to do this is $\\binom{n}{k}\\binom{n}{n-k} = \\binom{n}{k}^2$ by symmetry, summing over all possible $k$.",
            },
            {
                question: "Consider the identity $\\sum_{k=0}^{n} \\binom{n}{k}^2 = \\binom{2n}{n}$. What is the standard story proof for this identity (Vandermonde's Identity)? (Version 3)",
                options: [
                    "Choosing a committee of size $n$ from a group of $n$ men and $n$ women.",
                    "Choosing a committee of size $k$ from $2n$ candidates.",
                    "Arranging $2n$ people in two separate rows.",
                    "Choosing $n$ items with replacement from $n$ options."
                ],
                correctIndex: 0,
                explanation: "The right side is the number of ways to choose $n$ people from $2n$ total candidates. The left side counts the same by grouping by how many men are chosen ($k$). If we choose $k$ men, we must choose $n-k$ women. The ways to do this is $\\binom{n}{k}\\binom{n}{n-k} = \\binom{n}{k}^2$ by symmetry, summing over all possible $k$.",
            },
            {
                question: "Consider the identity $\\sum_{k=0}^{n} \\binom{n}{k}^2 = \\binom{2n}{n}$. What is the standard story proof for this identity (Vandermonde's Identity)? (Version 4)",
                options: [
                    "Choosing a committee of size $n$ from a group of $n$ men and $n$ women.",
                    "Choosing a committee of size $k$ from $2n$ candidates.",
                    "Arranging $2n$ people in two separate rows.",
                    "Choosing $n$ items with replacement from $n$ options."
                ],
                correctIndex: 0,
                explanation: "The right side is the number of ways to choose $n$ people from $2n$ total candidates. The left side counts the same by grouping by how many men are chosen ($k$). If we choose $k$ men, we must choose $n-k$ women. The ways to do this is $\\binom{n}{k}\\binom{n}{n-k} = \\binom{n}{k}^2$ by symmetry, summing over all possible $k$.",
            },
            {
                question: "Consider the identity $\\sum_{k=0}^{n} \\binom{n}{k}^2 = \\binom{2n}{n}$. What is the standard story proof for this identity (Vandermonde's Identity)? (Version 5)",
                options: [
                    "Choosing a committee of size $n$ from a group of $n$ men and $n$ women.",
                    "Choosing a committee of size $k$ from $2n$ candidates.",
                    "Arranging $2n$ people in two separate rows.",
                    "Choosing $n$ items with replacement from $n$ options."
                ],
                correctIndex: 0,
                explanation: "The right side is the number of ways to choose $n$ people from $2n$ total candidates. The left side counts the same by grouping by how many men are chosen ($k$). If we choose $k$ men, we must choose $n-k$ women. The ways to do this is $\\binom{n}{k}\\binom{n}{n-k} = \\binom{n}{k}^2$ by symmetry, summing over all possible $k$.",
            },
        ],
        hard: [
            {
                question: "The identity $\\sum_{k=1}^{n} k^2 \\binom{n}{k} = n(n-1)2^{n-2} + n 2^{n-1}$ is proven by counting which of the following? (Version 1)",
                options: [
                    "Choosing a committee of any size with a president and a vice president (who could be the same person).",
                    "Choosing a committee of size $k$ with a president and a vice president.",
                    "Choosing a committee of any size with two presidents.",
                    "Arranging a committee of size $k$ in a circle."
                ],
                correctIndex: 0,
                explanation: "The identity counts the number of ways to choose a committee of any size from $n$ people, with a president and a vice-president (who could be the same person).",
            },
            {
                question: "The identity $\\sum_{k=1}^{n} k^2 \\binom{n}{k} = n(n-1)2^{n-2} + n 2^{n-1}$ is proven by counting which of the following? (Version 2)",
                options: [
                    "Choosing a committee of any size with a president and a vice president (who could be the same person).",
                    "Choosing a committee of size $k$ with a president and a vice president.",
                    "Choosing a committee of any size with two presidents.",
                    "Arranging a committee of size $k$ in a circle."
                ],
                correctIndex: 0,
                explanation: "The identity counts the number of ways to choose a committee of any size from $n$ people, with a president and a vice-president (who could be the same person).",
            },
            {
                question: "The identity $\\sum_{k=1}^{n} k^2 \\binom{n}{k} = n(n-1)2^{n-2} + n 2^{n-1}$ is proven by counting which of the following? (Version 3)",
                options: [
                    "Choosing a committee of any size with a president and a vice president (who could be the same person).",
                    "Choosing a committee of size $k$ with a president and a vice president.",
                    "Choosing a committee of any size with two presidents.",
                    "Arranging a committee of size $k$ in a circle."
                ],
                correctIndex: 0,
                explanation: "The identity counts the number of ways to choose a committee of any size from $n$ people, with a president and a vice-president (who could be the same person).",
            },
            {
                question: "The identity $\\sum_{k=1}^{n} k^2 \\binom{n}{k} = n(n-1)2^{n-2} + n 2^{n-1}$ is proven by counting which of the following? (Version 4)",
                options: [
                    "Choosing a committee of any size with a president and a vice president (who could be the same person).",
                    "Choosing a committee of size $k$ with a president and a vice president.",
                    "Choosing a committee of any size with two presidents.",
                    "Arranging a committee of size $k$ in a circle."
                ],
                correctIndex: 0,
                explanation: "The identity counts the number of ways to choose a committee of any size from $n$ people, with a president and a vice-president (who could be the same person).",
            },
            {
                question: "The identity $\\sum_{k=1}^{n} k^2 \\binom{n}{k} = n(n-1)2^{n-2} + n 2^{n-1}$ is proven by counting which of the following? (Version 5)",
                options: [
                    "Choosing a committee of any size with a president and a vice president (who could be the same person).",
                    "Choosing a committee of size $k$ with a president and a vice president.",
                    "Choosing a committee of any size with two presidents.",
                    "Arranging a committee of size $k$ in a circle."
                ],
                correctIndex: 0,
                explanation: "The identity counts the number of ways to choose a committee of any size from $n$ people, with a president and a vice-president (who could be the same person).",
            },
        ],
    },
    complement: {
        easy: [
            {
                question: "A fair coin is flipped 4 times. What is the probability of getting at least one heads?",
                options: ["$\\frac{15}{16}$", "$\\frac{1}{16}$", "$\\frac{3}{4}$", "$\\frac{1}{2}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one heads' is 'no heads' (all tails). The probability of all tails is $(\\frac{1}{2})^{4} = \\frac{1}{16}$. By complementary counting, $P(\\text{at least one heads}) = 1 - \\frac{1}{16} = \\frac{15}{16}$.",
            },
            {
                question: "A fair coin is flipped 5 times. What is the probability of getting at least one heads?",
                options: ["$\\frac{31}{32}$", "$\\frac{1}{32}$", "$\\frac{4}{5}$", "$\\frac{1}{2}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one heads' is 'no heads' (all tails). The probability of all tails is $(\\frac{1}{2})^{5} = \\frac{1}{32}$. By complementary counting, $P(\\text{at least one heads}) = 1 - \\frac{1}{32} = \\frac{31}{32}$.",
            },
            {
                question: "A fair coin is flipped 3 times. What is the probability of getting at least one heads?",
                options: ["$\\frac{7}{8}$", "$\\frac{1}{8}$", "$\\frac{2}{3}$", "$\\frac{1}{2}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one heads' is 'no heads' (all tails). The probability of all tails is $(\\frac{1}{2})^{3} = \\frac{1}{8}$. By complementary counting, $P(\\text{at least one heads}) = 1 - \\frac{1}{8} = \\frac{7}{8}$.",
            },
            {
                question: "A fair coin is flipped 6 times. What is the probability of getting at least one heads?",
                options: ["$\\frac{63}{64}$", "$\\frac{1}{64}$", "$\\frac{5}{6}$", "$\\frac{1}{2}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one heads' is 'no heads' (all tails). The probability of all tails is $(\\frac{1}{2})^{6} = \\frac{1}{64}$. By complementary counting, $P(\\text{at least one heads}) = 1 - \\frac{1}{64} = \\frac{63}{64}$.",
            },
            {
                question: "A fair coin is flipped 7 times. What is the probability of getting at least one heads?",
                options: ["$\\frac{127}{128}$", "$\\frac{1}{128}$", "$\\frac{6}{7}$", "$\\frac{1}{2}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one heads' is 'no heads' (all tails). The probability of all tails is $(\\frac{1}{2})^{7} = \\frac{1}{128}$. By complementary counting, $P(\\text{at least one heads}) = 1 - \\frac{1}{128} = \\frac{127}{128}$.",
            },
        ],
        medium: [
            {
                question: "A committee of 3 is chosen from 4 men and 4 women. How many committees contain at least one man and at least one woman?",
                options: ["48", "56", "8", "52"],
                correctIndex: 0,
                explanation: "Use complementary counting: subtract all-male and all-female committees from total. Total: $\\binom{8}{3}=56$. All-male: $\\binom{4}{3}=4$. All-female: $\\binom{4}{3}=4$. Mixed: $56 - 4 - 4 = 48$.",
            },
            {
                question: "A committee of 3 is chosen from 5 men and 5 women. How many committees contain at least one man and at least one woman?",
                options: ["100", "120", "20", "110"],
                correctIndex: 0,
                explanation: "Use complementary counting: subtract all-male and all-female committees from total. Total: $\\binom{10}{3}=120$. All-male: $\\binom{5}{3}=10$. All-female: $\\binom{5}{3}=10$. Mixed: $120 - 10 - 10 = 100$.",
            },
            {
                question: "A committee of 4 is chosen from 4 men and 4 women. How many committees contain at least one man and at least one woman?",
                options: ["68", "70", "2", "69"],
                correctIndex: 0,
                explanation: "Use complementary counting: subtract all-male and all-female committees from total. Total: $\\binom{8}{4}=70$. All-male: $\\binom{4}{4}=1$. All-female: $\\binom{4}{4}=1$. Mixed: $70 - 1 - 1 = 68$.",
            },
            {
                question: "A committee of 4 is chosen from 5 men and 5 women. How many committees contain at least one man and at least one woman?",
                options: ["200", "210", "10", "205"],
                correctIndex: 0,
                explanation: "Use complementary counting: subtract all-male and all-female committees from total. Total: $\\binom{10}{4}=210$. All-male: $\\binom{5}{4}=5$. All-female: $\\binom{5}{4}=5$. Mixed: $210 - 5 - 5 = 200$.",
            },
            {
                question: "A committee of 3 is chosen from 6 men and 6 women. How many committees contain at least one man and at least one woman?",
                options: ["180", "220", "40", "200"],
                correctIndex: 0,
                explanation: "Use complementary counting: subtract all-male and all-female committees from total. Total: $\\binom{12}{3}=220$. All-male: $\\binom{6}{3}=20$. All-female: $\\binom{6}{3}=20$. Mixed: $220 - 20 - 20 = 180$.",
            },
        ],
        hard: [
            {
                question: "If you roll 5 fair 6-sided dice, what is the probability that you roll at least one 6?",
                options: ["$1 - (\\frac{5}{6})^{5}$", "$(\\frac{1}{6})^{5}$", "$\\frac{5}{6}$", "$1 - (\\frac{1}{6})^{5}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one 6' is 'no 6s'. The probability of rolling no 6s on 5 dice is $(\\frac{5}{6})^{5}$. Thus, by complementary counting, $P(\\text{at least one 6}) = 1 - (\\frac{5}{6})^{5}$.",
            },
            {
                question: "If you roll 4 fair 6-sided dice, what is the probability that you roll at least one 6?",
                options: ["$1 - (\\frac{5}{6})^{4}$", "$(\\frac{1}{6})^{4}$", "$\\frac{5}{6}$", "$1 - (\\frac{1}{6})^{4}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one 6' is 'no 6s'. The probability of rolling no 6s on 4 dice is $(\\frac{5}{6})^{4}$. Thus, by complementary counting, $P(\\text{at least one 6}) = 1 - (\\frac{5}{6})^{4}$.",
            },
            {
                question: "If you roll 6 fair 6-sided dice, what is the probability that you roll at least one 6?",
                options: ["$1 - (\\frac{5}{6})^{6}$", "$(\\frac{1}{6})^{6}$", "$\\frac{5}{6}$", "$1 - (\\frac{1}{6})^{6}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one 6' is 'no 6s'. The probability of rolling no 6s on 6 dice is $(\\frac{5}{6})^{6}$. Thus, by complementary counting, $P(\\text{at least one 6}) = 1 - (\\frac{5}{6})^{6}$.",
            },
            {
                question: "If you roll 3 fair 6-sided dice, what is the probability that you roll at least one 6?",
                options: ["$1 - (\\frac{5}{6})^{3}$", "$(\\frac{1}{6})^{3}$", "$\\frac{5}{6}$", "$1 - (\\frac{1}{6})^{3}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one 6' is 'no 6s'. The probability of rolling no 6s on 3 dice is $(\\frac{5}{6})^{3}$. Thus, by complementary counting, $P(\\text{at least one 6}) = 1 - (\\frac{5}{6})^{3}$.",
            },
            {
                question: "If you roll 7 fair 6-sided dice, what is the probability that you roll at least one 6?",
                options: ["$1 - (\\frac{5}{6})^{7}$", "$(\\frac{1}{6})^{7}$", "$\\frac{5}{6}$", "$1 - (\\frac{1}{6})^{7}$"],
                correctIndex: 0,
                explanation: "The complement of 'at least one 6' is 'no 6s'. The probability of rolling no 6s on 7 dice is $(\\frac{5}{6})^{7}$. Thus, by complementary counting, $P(\\text{at least one 6}) = 1 - (\\frac{5}{6})^{7}$.",
            },
        ],
    },
    inclusion_exclusion: {
        easy: [
            {
                question: "If $P(A) = 0.6$, $P(B) = 0.4$, and $P(A \\cap B) = 0.2$, what is the union probability $P(A \\cup B)$?",
                options: ["0.8", "1.0", "0.6", "0.4"],
                correctIndex: 0,
                explanation: "By the Principle of Inclusion-Exclusion (PIE): $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.6 + 0.4 - 0.2 = 0.8$.",
            },
            {
                question: "If $P(A) = 0.7$, $P(B) = 0.5$, and $P(A \\cap B) = 0.3$, what is the union probability $P(A \\cup B)$?",
                options: ["0.9", "1.0", "0.7", "0.5"],
                correctIndex: 0,
                explanation: "By the Principle of Inclusion-Exclusion (PIE): $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.7 + 0.5 - 0.3 = 0.9$.",
            },
            {
                question: "If $P(A) = 0.5$, $P(B) = 0.5$, and $P(A \\cap B) = 0.1$, what is the union probability $P(A \\cup B)$?",
                options: ["0.9", "1.0", "0.5", "0.5"],
                correctIndex: 0,
                explanation: "By the Principle of Inclusion-Exclusion (PIE): $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.5 + 0.5 - 0.1 = 0.9$.",
            },
            {
                question: "If $P(A) = 0.8$, $P(B) = 0.3$, and $P(A \\cap B) = 0.2$, what is the union probability $P(A \\cup B)$?",
                options: ["0.9", "1.0", "0.8", "0.3"],
                correctIndex: 0,
                explanation: "By the Principle of Inclusion-Exclusion (PIE): $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.8 + 0.3 - 0.2 = 0.9$.",
            },
            {
                question: "If $P(A) = 0.6$, $P(B) = 0.6$, and $P(A \\cap B) = 0.4$, what is the union probability $P(A \\cup B)$?",
                options: ["0.8", "1.0", "0.6", "0.6"],
                correctIndex: 0,
                explanation: "By the Principle of Inclusion-Exclusion (PIE): $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.6 + 0.6 - 0.4 = 0.8$.",
            },
        ],
        medium: [
            {
                question: "In a class of 30 students, 18 play soccer, 15 play basketball, and 8 play both. How many students play soccer OR basketball?",
                options: ["25", "30", "33", "8"],
                correctIndex: 0,
                explanation: "Let $S$ be the set of soccer players and $B$ the set of basketball players. By PIE: $|S \\cup B| = |S| + |B| - |S \\cap B| = 18 + 15 - 8 = 25$.",
            },
            {
                question: "In a class of 40 students, 20 play soccer, 25 play basketball, and 10 play both. How many students play soccer OR basketball?",
                options: ["35", "40", "45", "10"],
                correctIndex: 0,
                explanation: "Let $S$ be the set of soccer players and $B$ the set of basketball players. By PIE: $|S \\cup B| = |S| + |B| - |S \\cap B| = 20 + 25 - 10 = 35$.",
            },
            {
                question: "In a class of 50 students, 30 play soccer, 20 play basketball, and 15 play both. How many students play soccer OR basketball?",
                options: ["35", "50", "50", "15"],
                correctIndex: 0,
                explanation: "Let $S$ be the set of soccer players and $B$ the set of basketball players. By PIE: $|S \\cup B| = |S| + |B| - |S \\cap B| = 30 + 20 - 15 = 35$.",
            },
            {
                question: "In a class of 25 students, 12 play soccer, 14 play basketball, and 5 play both. How many students play soccer OR basketball?",
                options: ["21", "25", "26", "5"],
                correctIndex: 0,
                explanation: "Let $S$ be the set of soccer players and $B$ the set of basketball players. By PIE: $|S \\cup B| = |S| + |B| - |S \\cap B| = 12 + 14 - 5 = 21$.",
            },
            {
                question: "In a class of 35 students, 20 play soccer, 22 play basketball, and 12 play both. How many students play soccer OR basketball?",
                options: ["30", "35", "42", "12"],
                correctIndex: 0,
                explanation: "Let $S$ be the set of soccer players and $B$ the set of basketball players. By PIE: $|S \\cup B| = |S| + |B| - |S \\cap B| = 20 + 22 - 12 = 30$.",
            },
        ],
        hard: [
            {
                question: "How many integers between 1 and 100 (inclusive) are divisible by 2 OR 3 OR 5?",
                options: ["74", "100", "103", "97"],
                correctIndex: 0,
                explanation: "Let $A, B, C$ be integers divisible by 2, 3, 5 respectively. $|A| = 50$, $|B| = 33$, $|C| = 20$. Overlaps: $|A \\cap B| = 16$, $|A \\cap C| = 10$, $|B \\cap C| = 6$. Triple overlap: $|A \\cap B \\cap C| = 3$. By PIE: $50 + 33 + 20 - 16 - 10 - 6 + 3 = 74$.",
            },
            {
                question: "How many integers between 1 and 120 (inclusive) are divisible by 2 OR 3 OR 5?",
                options: ["88", "120", "124", "116"],
                correctIndex: 0,
                explanation: "Let $A, B, C$ be integers divisible by 2, 3, 5 respectively. $|A| = 60$, $|B| = 40$, $|C| = 24$. Overlaps: $|A \\cap B| = 20$, $|A \\cap C| = 12$, $|B \\cap C| = 8$. Triple overlap: $|A \\cap B \\cap C| = 4$. By PIE: $60 + 40 + 24 - 20 - 12 - 8 + 4 = 88$.",
            },
            {
                question: "How many integers between 1 and 150 (inclusive) are divisible by 2 OR 3 OR 5?",
                options: ["110", "150", "155", "145"],
                correctIndex: 0,
                explanation: "Let $A, B, C$ be integers divisible by 2, 3, 5 respectively. $|A| = 75$, $|B| = 50$, $|C| = 30$. Overlaps: $|A \\cap B| = 25$, $|A \\cap C| = 15$, $|B \\cap C| = 10$. Triple overlap: $|A \\cap B \\cap C| = 5$. By PIE: $75 + 50 + 30 - 25 - 15 - 10 + 5 = 110$.",
            },
            {
                question: "How many integers between 1 and 200 (inclusive) are divisible by 2 OR 3 OR 5?",
                options: ["146", "200", "206", "194"],
                correctIndex: 0,
                explanation: "Let $A, B, C$ be integers divisible by 2, 3, 5 respectively. $|A| = 100$, $|B| = 66$, $|C| = 40$. Overlaps: $|A \\cap B| = 33$, $|A \\cap C| = 20$, $|B \\cap C| = 13$. Triple overlap: $|A \\cap B \\cap C| = 6$. By PIE: $100 + 66 + 40 - 33 - 20 - 13 + 6 = 146$.",
            },
            {
                question: "How many integers between 1 and 90 (inclusive) are divisible by 2 OR 3 OR 5?",
                options: ["66", "90", "93", "87"],
                correctIndex: 0,
                explanation: "Let $A, B, C$ be integers divisible by 2, 3, 5 respectively. $|A| = 45$, $|B| = 30$, $|C| = 18$. Overlaps: $|A \\cap B| = 15$, $|A \\cap C| = 9$, $|B \\cap C| = 6$. Triple overlap: $|A \\cap B \\cap C| = 3$. By PIE: $45 + 30 + 18 - 15 - 9 - 6 + 3 = 66$.",
            },
        ],
    },
};
