import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import WithdrawalsListItem from 'ui/withdrawals/WithdrawalsListItem';
import WithdrawalsTable from 'ui/withdrawals/WithdrawalsTable';

const Withdrawals = () => {
  const isMobile = useIsMobile();

  const { data, isError, isLoading, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'withdrawals',
  });

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    const text = isLoading ?
      <Skeleton w="400px" h="26px" mb={{ base: 6, lg: 0 }}/> :
      <Text mb={{ base: 6, lg: 0 }}>A total of { data.total } withdrawals found</Text>;

    const bar = (
      <>
        { isMobile && text }
        <ActionBar mt={ -6 }>
          <Flex alignItems="center" justifyContent="space-between" w="100%">
            { !isMobile && text }
            { isPaginationVisible && <Pagination ml="auto" { ...pagination }/> }
          </Flex>
        </ActionBar>
      </>
    );
    if (isLoading) {
      return (
        <>
          { bar }
          <SkeletonList display={{ base: 'block', lg: 'none' }}/>
          <SkeletonTable display={{ base: 'none', lg: 'block' }} columns={ Array(7).fill(`${ 100 / 7 }%`) }/>
        </>
      );
    }
    return (
      <>
        { bar }
        <Show below="lg" ssr={ false }>{ data.items.map((item => <WithdrawalsListItem key={ item.l2_tx_hash } { ...item }/>)) }</Show>
        <Hide below="lg" ssr={ false }><WithdrawalsTable items={ data.items } top={ isPaginationVisible ? 80 : 0 }/></Hide>
      </>
    );
  })();

  return (
    <Page>
      <PageTitle text={ `Withdrawals (L2${ nbsp }${ rightLineArrow }${ nbsp }L1)` } withTextAd/>
      { content }
    </Page>
  );
};

export default Withdrawals;
