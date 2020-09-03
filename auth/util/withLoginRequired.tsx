import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import withWrapper, { IComponentProps } from './withWrapper';

export interface RequireLoginProps extends IComponentProps {
  path: string;
}

export default function withLoginRequired(
  ChildComponent: React.ComponentClass<any>
): React.ReactNode {
  return withWrapper<RequireLoginProps>(
    ChildComponent,
    'withLoginRequired',
    ({ path, ...rest }) => {
      const { isAuthenticated, isLoading } = useAuth();
      const router = useRouter();
      useEffect(() => {
        if (isAuthenticated) {
          return;
        }
        if (!isLoading) router.push('/auth');
      });

      return isAuthenticated === true ? <ChildComponent {...rest} /> : null;
    }
  );
}
