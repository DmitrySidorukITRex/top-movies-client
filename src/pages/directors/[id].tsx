import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { initializeApollo } from '../../../apollo-client';
import DirectorDetailsLayout from '../../containers/DirectorDetailsLayout';
import { Director } from '../../interfaces/director';
import { GET_DIRECTOR } from '../../services/directors';
import { Movie } from '../../interfaces/movie';

const DirectorDetails: NextPage = () => {
  const router = useRouter();
  const { data } = useQuery(GET_DIRECTOR, {
    variables: { id: router.query.id },
  });
  const director: Director = data.director;

  const onMovieClick = (movie: Movie) => {
    router.push(`/movies/${movie.id}`);
  };

  return (
    <>
      <Head>
        <title>{director.name + 'details'}</title>
        <meta
          name="description"
          content={'Here are ' + director.name + ' details'}
        />
      </Head>
      <DirectorDetailsLayout director={director} onMovieClick={onMovieClick} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();

  const { id } = context.params as ParsedUrlQuery;

  await apolloClient.query({
    query: GET_DIRECTOR,
    variables: { id },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default DirectorDetails;
