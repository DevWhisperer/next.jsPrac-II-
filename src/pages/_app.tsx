import PageLayout from 'components/Layout/PageLayout';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </div>
  );
}
