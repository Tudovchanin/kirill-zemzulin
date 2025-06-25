declare function useMail(): {
  send: (options: {
    from: string
    replyTo:string
    subject: string
    text: string
    // другие опции по необходимости
  }) => Promise<void>
}
