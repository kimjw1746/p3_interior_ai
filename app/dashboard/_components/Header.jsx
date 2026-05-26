"use client"
import React, { useContext } from 'react';
import { UserButton } from '@clerk/nextjs';
import { UserDetailContext } from '../../_context/UserDetailContext';
import Link from 'next/link';

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  return (
    <div className="navbar bg-base-100 shadow-sm p-5 flex justify-between items-center">
      <div className="flex-1">
        {/* 로고 클릭 시 메인 랜딩 페이지로 이동 */}
        <Link href='/' className='btn btn-ghost text-xl font-bold text-primary'>
          Interior AI
        </Link>
      </div>
      <div className="flex-none flex gap-7 items-center">
        {/* 크레딧 구매 페이지 링크 */}
        <Link href="/dashboard/buy-credits" className="btn btn-ghost text-primary font-semibold">
          Buy More Credits
        </Link>
        <div className="flex gap-2 p-1 px-3 bg-slate-200 rounded-full items-center">
          <div className="badge badge-secondary">
            {userDetail?.credits}
          </div>
          <h2 className="text-primary font-bold">Credits left</h2>
        </div>
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
