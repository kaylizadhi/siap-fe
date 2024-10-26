import { Caudex } from 'next/font/google'

const caudex = Caudex({ weight: '700', subsets: ['latin'] })

export default function DaftarAkun() {
    return (
        <div>
            <h1 class={`text-4xl font-bold mb-6 text-primary-900 ${caudex.className}`}>
                Daftar Akun
            </h1>
            <div className="w-full flex px-4 py-3 mb-3 rounded-md border-2 border overflow-hidden mx-auto font-[sans-serif]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                    class="fill-gray-600 mr-3 rotate-90">
                    <path
                        d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                    </path>
                </svg>
                <input type="text" placeholder="Cari Klien" class="w-full outline-none bg-transparent text-gray-600 text-sm" />
            </div>
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td>
                            <div class="flex items-center pl-2 py-4">
                                <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />                            </div>
                        </td>
                        <td scope="row" class="px-6 py-4">
                            <p className="font-bold text-gray-700">Jane Doe</p>
                            <p className="text-medium ">Senior Designer</p>
                        </td>
                        <td class="px-6 py-4">
                            Cell Text
                        </td>
                        <td class="px-6 py-4">
                            <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">Badges</span>
                        </td>
                        <td class="pl-6 py-4">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#A52525"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                        </td>
                        <td class="pr-6 py-4">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#A52525"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>                        
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    );
}
