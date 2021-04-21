export interface quizAns {
    id: number;
    question: string;
    count:number;
    choices: {id:number,choice:string , isCorrect: boolean}[];
  
  }
  
  export default quizAns;