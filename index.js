const labeler = require('./lib/labeler')
const greetings = require('./lib/greetings')
const utils = require('./lib/utils')

module.exports = app => {
  app.log('Yay, the app was loaded!')

  app.on('*', async context => {
    context.log({ event: context.event, action: context.payload.action })
  })

  // "Labeler" - Add Labels on PRs
  app.on([
    'pull_request.opened',
    'pull_request.reopened',
    'pull_request.edited',
    'pull_request.synchronize'], async context => {
    const config = await utils.getConfig(context)
    await labeler.addLabelsOnPr(context, config)
  })

  // "Greetings" - Welcome Authors on opening their first PR
  app.on('pull_request.opened', async context => {
    const config = await utils.getConfig(context)
    await greetings.commentOnfirstPR(context, config)
  })

  // "Greetings" - Congratulate Authors on getting their first PR merged
  app.on('pull_request.closed', async context => {
    const config = await utils.getConfig(context)
    await greetings.commentOnfirstPRMerge(context, config)
  })

  // "Greetings" - Welcome Authors on opening their first Issue
  app.on('issues.opened', async context => {
    const config = await utils.getConfig(context)
    await greetings.commentOnfirstIssue(context, config)
  })
}
