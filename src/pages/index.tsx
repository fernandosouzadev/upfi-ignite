import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type DataPage = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type Page = {
  data: DataPage[];
  after: string;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = null }) => {
      const options =
        pageParam !== null
          ? {
              params: {
                after: pageParam,
              },
            }
          : {};
      const response = await api.get<Page>(`/api/images`, options);
      return response.data;
    },
    {
      getNextPageParam: (lastPage, pages) =>
        // eslint-disable-next-line no-extra-boolean-cast
        !!lastPage.after ? lastPage.after : null,
    }
    // TODO GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    return data?.pages.map(el => el.data).flat(1);
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
