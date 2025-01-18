import moment from 'moment';
import React from 'react';

export function DateFormatComponent({
  date,
  format,
}: {
  date: Date;
  format?: string;
}) {
  return <>{moment(date).format(format ? format : 'DD MMM YYYY')}</>;
}
