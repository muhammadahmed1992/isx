import React from 'react';
import ReportComponent from '../components/ReportComponent';

const ReportGenerator = ({navigation, route}) => {
  const {label, dateRangeSetter, stockInputField, warehouseInputField, endPoint} = route.params;
  const currentRouteName = route.name;

  return (
    <ReportComponent
      navigation={navigation}
      currentRouteName={currentRouteName}
      label={label}
      dateRangeSetter={dateRangeSetter}
      stockInputField={stockInputField}
      warehouseInputField={warehouseInputField}
      endPoint={endPoint}
    />
  );
};

export default ReportGenerator;
