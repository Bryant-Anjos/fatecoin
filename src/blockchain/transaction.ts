import crypto from 'crypto'

class Transaction {
  id: string
  inputs: Input[]
  outputs: Output[]
}

class Output {
  address: string
  amount: number

  constructor(address: string, amount: number) {
    this.address = address
    this.amount = amount
  }
}

class Input {
  outputId: string
  outputIndex: number
  signature: string
}

class UnspentOutput extends Output {
  outputId: string
  outputIndex: number

  constructor(
    outputId: string,
    outputIndex: number,
    address: string,
    amount: number
  ) {
    super(address, amount)
    this.outputId = outputId
    this.outputIndex = outputIndex
  }
}

class UnspentOutputs {
  private listUtxo: UnspentOutput[]

  constructor() {
    this.listUtxo = []
  }

  newUnsppentOutputs(transactions: Transaction[]) {
    list = transactions.map(transaction => {
      return transaction.inputs.map(input => new UnspentOutput(transaction.id, input.outputIndex, input.))
    })
  }
}

function idTransaction(transaction: Transaction) {
  const inputContents = transaction.inputs.reduce(
    (inputContent, input) =>
      (inputContent += input.outputId + input.outputIndex),
    ''
  )

  const outputContents = transaction.outputs.reduce(
    (outputContent, output) =>
      (outputContent += output.address + output.amount),
    ''
  )

  return crypto
    .createHash('sha256')
    .update(inputContents + outputContents)
    .digest('hex')
}
