import { BadRequestException } from '@nestjs/common';
import { getFieldLabel } from '../utils/global.variable';

export const ExistFieldInResourceException = (fieldName: string) => {
  const message = `${getFieldLabel(fieldName)}已经存在` || '资源名称已经存在';
  return new BadRequestException(message);
};

export const NotExistResouceException = (fieldName: string) => {
  const message = `${getFieldLabel(fieldName)}不存在` || '资源不存在';
  return new BadRequestException(message);
};

export const ExistErrorIdAndPidException = (fieldName: string) => {
  const message =
    `${getFieldLabel(fieldName)}ID和PID不能一样` || '资源ID和PID不能一样';
  return new BadRequestException(message);
};
