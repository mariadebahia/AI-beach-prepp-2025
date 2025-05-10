import React, { useState, ChangeEvent } from 'react';
import { quizQuestions, QuizQuestion, QuizResult } from '../utils/quizData';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { Dumbbell, Brain, Rocket, TrendingUp, Users } from 'lucide-react';

// API Configuration
const MANUS_WEBHOOK_URL = 'https://29yhyi3c9q7y.manus.space/quiz_submit';
const API_KEY = 'ed5aed3cdd2410758637cc8a50e26f4bb4402bead81885f55a933331228fb5f1';

// Rest of the file remains unchanged
[... rest of the file content remains exactly the same ...]