import * as readline from "readline"

import { NetworksOptions } from "./enums.js"

export async function askForNetwork(): Promise<NetworksOptions> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(
      `Digite a opção relacionada a rede que deseja se conectar: \n
        1 - MAINNET
        2 - TESTNET
      > `, input => {
        const isInputValid = [NetworksOptions.MAINNET, NetworksOptions.TESTNET].includes(input as NetworksOptions);
  
        if (isInputValid) {
          rl.close();
          resolve(input as NetworksOptions);            
        } else {
          console.log('Opção inválida!');
          resolve(askForNetwork());
        }  
    });
  });
}

interface IAskForDataTransactionResponse {
  transactionId: string;
  sourceMessage: string;
}
export async function askForDataTransaction(): Promise<IAskForDataTransactionResponse> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(`Digite o id da transação a ser verificada: `, input => { 
      const transactionId = input;
      
      rl.question(`Digite qual a mensagem originalmente assinada: `, input => {
        const sourceMessage = input;
        
        rl.close();
        resolve({ transactionId, sourceMessage }); 
      });
    });
  });
}