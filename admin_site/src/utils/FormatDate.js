import moment from 'moment';

export default function FormatDate(posted_time) {
  return moment(posted_time).format('DD/MM/YYYY');
}
