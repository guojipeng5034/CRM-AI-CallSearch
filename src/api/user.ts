// src/api/user.ts
import request from '@/utils/request'

export const getUserInfo = (id: number) => {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}