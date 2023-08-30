import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export const withRedirect = (gssp?: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    const host = context.req.headers.host || '';
    const path = context.req.url || '';

    if ((host === 'degenpicks.xyz' || host === 'staging.degenpicks.xyz') && path !== '/') {
      return {
        redirect: {
          destination: `https://app.${host}${path}`,
          permanent: false,
        },
      };
    }

    // Call the original getServerSideProps function, if provided
    return gssp ? await gssp(context) : { props: {} };
  };
};