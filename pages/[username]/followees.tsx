import { StackDivider } from "@chakra-ui/react"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { ShowUserPageListFollowees } from "app/users/components/ShowUserPageListFollowees"
import { BlitzPage, useSession } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const ShowUserFolloweesPage: BlitzPage = () => {
  const { t } = useTranslation()

  const session = useSession()

  if (session.isLoading) {
    return <p>{"loading..."}</p>
  }

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Followees")}</BoxHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowUserPageListFollowees userId={session.userId} />
      </Suspense>
    </StackMain>
  )
}

ShowUserFolloweesPage.getLayout = (page) => {
  return <Layout title={"Followees"}>{page}</Layout>
}

export default ShowUserFolloweesPage
