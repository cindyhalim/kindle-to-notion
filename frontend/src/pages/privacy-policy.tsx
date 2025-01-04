import { Link, Text } from 'rebass'
import { BaseLayout } from '../layout/base-layout'
import { theme } from '../layout/theme'

export const PrivacyPolicy = () => (
  <BaseLayout title={'privacy policy'} buttons={[]}>
    <Text sx={{ ...theme.heading, marginBottom: 10, marginTop: 20 }}>
      notion integration:
    </Text>
    <Text sx={{ fontWeight: 300 }}>
      {'notion <> kindle'} requires access to your notion reading list page.
      sending epub files to your kindle requires reading the email and read list
      notion databases. if you use the notion reads chrome extension, it writes
      to the read list database.
    </Text>
    <Text sx={{ ...theme.heading, marginBottom: 10, marginTop: 20 }}>
      email addresses:
    </Text>
    <Text sx={{ fontWeight: 300 }}>
      {
        'notion <> kindle uses email to send to your kindle. more of how this works can be found '
      }
      <Link
        sx={{ color: theme.colors.black }}
        target="_blank"
        href="  https://www.amazon.com/sendtokindle/email"
      >
        here
      </Link>
      <br />
      <br />
      to do so, {'notion <> kindle'} requires your kindle email address– we do
      not store this email address. additionally, you are required to add
      notionkindle@gmail.com to your authorized amazon kindle approved email
      list. your kindle will only receive files from the email addresses on this
      list
    </Text>
  </BaseLayout>
)
