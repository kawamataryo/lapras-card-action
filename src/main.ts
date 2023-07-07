import * as core from '@actions/core'
import {updateReadme} from './lib/updateReadme'
import {rewriteReadmeToIncludeCardText} from './lib/rewriteReadmeToIncludeCardText'
import {fetchScore} from './lib/fetchScore'
import {fetchPrevReadmeContent} from './lib/fetchPrevReadmeContents'
import {getActionsParams} from './lib/getActionsParams'

async function run(): Promise<void> {
  try {
    const {
      shareId,
      readmeFile,
      theme,
      lang,
      cardWidth,
      token,
      showUpdateTime,
      isCenter,
      alternativeText
    } = getActionsParams()
    const readmeContent = await fetchPrevReadmeContent(token, readmeFile)
    const score = await fetchScore(shareId)

    const readme = rewriteReadmeToIncludeCardText(readmeContent.text, {
      shareId,
      score,
      theme,
      lang,
      cardWidth,
      showUpdateTime,
      isCenter,
      alternativeText
    })

    await updateReadme({ghToken: token, readme, sha: readmeContent.sha})
  } catch (error) {
    if (error instanceof Error) core.setFailed(error)
  }
}

run()
