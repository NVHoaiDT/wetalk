import { Clock, Flame, Star, TrendingUp, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Spinner } from '@/components/ui/spinner';
import { useInfiniteAllPosts } from '@/features/dashboard/api/get-all-posts';
import { fancyLog } from '@/helper/fancy-log';

import { DashboardPostCard } from './dashboard-post-card';
import { SelectTags } from './select-tags';

const sortOptions = [
  { value: 'best', label: 'Best', icon: Star, color: 'text-yellow-500' },
  { value: 'hot', label: 'Hot', icon: Flame, color: 'text-orange-500' },
  { value: 'new', label: 'New', icon: Clock, color: 'text-blue-500' },
  { value: 'top', label: 'Top', icon: TrendingUp, color: 'text-green-500' },
] as const;

type SortType = (typeof sortOptions)[number]['value'];

export const DashboardPostsFeed = () => {
  const [sortBy, setSortBy] = useState<SortType>('best');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteAllPosts({ sortBy, tags: selectedTags });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const currentSort = sortOptions.find((opt) => opt.value === sortBy);
  const CurrentSortIcon = currentSort?.icon || Star;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  fancyLog('DASHBOARD-POSTS: ', posts);
  /* 
  [    
    {
        "id": 57,
        "communityId": 9,
        "community": {
            "id": 9,
            "name": "UI/UX Designers",
            "shortDescription": "Thiết kế giao diện và trải nghiệm người dùng"
        },
        "authorId": 1,
        "author": {
            "id": 1,
            "username": "nguyenvana",
            "avatar": "https://res.cloudinary.com/dd2dhsems/image/upload/v1762442989/images/post/cloudinary_post_b91ca9d0-8781-44cc-9b7d-fe48203ca9cd_1762442986.webp"
        },
        "title": "Kafka",
        "type": "text",
        "content": "<h4><strong>TECH LEAD CHIA SẺ: LỘ TRÌNH HỌC ĐỂ TRỞ THÀNH SECURITY ENGINEER</strong></h4><blockquote><p><strong>// Chia sẻ từ Saed, Senior Security Engineer, có 5 năm kinh nghiệm tại Google</strong></p></blockquote><p>Tôi là Senior Security Engineer tại Google với hơn 5 năm kinh nghiệm. Nếu được quay lại những ngày đầu luyện phỏng vấn an ninh mạng, tôi sẽ học 50+ bài toán thực tế này thay vì lãng phí nhiều tháng nhảy giữa blog, khóa học và các bài CTF ngẫu nhiên.</p><p>Đây là những nền tảng thực sự quan trọng khi làm việc ở quy mô lớn và cũng là những vấn đề mà Security Engineer phải giải quyết bên trong Google, Meta, Amazon.</p><h5><strong>1) Risk, Access, Identity</strong></h5><p><strong>➤ Thiết kế hệ thống xác thực an toàn cho 1 tỷ người dùng</strong></p><ul><li><p>Xem xét password hashing, giới hạn tốc độ đăng nhập, và tín hiệu từ thiết bị.</p></li><li><p>Tìm hiểu cách luồng đăng nhập bị ảnh hưởng khi độ trễ tăng ở quy mô lớn.</p></li><li><p>Hiểu rõ cách lưu trữ thông tin đăng nhập an toàn và cách phản ứng trước tấn công credential stuffing hàng loạt.</p></li></ul><p><strong>➤ Xây dựng login dựa trên OAuth cho ứng dụng bên thứ ba</strong></p><ul><li><p>Hiểu authorization code, refresh token, và các vấn đề bảo mật khi redirect.</p></li><li><p>Suy nghĩ về scopes và cách giới hạn quyền truy cập của ứng dụng.</p></li><li><p>Xử lý token bị đánh cắp, xoay vòng token, và cơ chế thu hồi hợp lý.</p></li></ul><p><strong>➤ Thiết kế mô hình Zero Trust cho một công ty lớn</strong></p><ul><li><p>Không có yêu cầu nào được tin tưởng mặc định; mọi truy cập đều phải xác minh.</p></li><li><p>Tìm hiểu định tuyến dựa trên danh tính, kiểm tra tình trạng thiết bị, và xác thực liên tục.</p></li><li><p>Hiểu sự đánh đổi giữa năng suất lập trình viên và kiểm soát truy cập nghiêm ngặt.</p></li></ul><p><strong>➤ Tạo hệ thống tự động rà soát đặc quyền (privileged access)</strong></p><ul><li><p>Phát hiện và tự động xóa quyền admin không dùng đến.</p></li><li><p>Kích hoạt quy trình review định kỳ cho vai trò có rủi ro cao.</p></li><li><p>Duy trì audit log đáp ứng yêu cầu tuân thủ mà không cản trở kỹ sư.</p></li></ul><p><strong>➤ Xây dựng hệ thống quản lý phiên (session management) an toàn cho mobile app</strong></p><ul><li><p>Xem xét session ID, refresh token, timeout khi không hoạt động.</p></li><li><p>Xử lý phiên trên nhiều thiết bị và nền tảng.</p></li><li><p>Bảo vệ phiên khỏi replay, đánh cắp, và fixation.</p></li></ul><p><strong>➤ Thiết kế dịch vụ MFA hoạt động ổn định trên toàn thế giới</strong></p><ul><li><p>Cân nhắc độ trễ SMS, mạng không ổn định, và chiến lược fallback.</p></li><li><p>Hỗ trợ TOTP, push notification và khóa cứng (hardware key).</p></li><li><p>Giảm ma sát nhưng vẫn tăng mức độ tin cậy.</p></li></ul><p><strong>➤ Xử lý quy trình khôi phục tài khoản (account recovery) an toàn ở quy mô lớn</strong></p><ul><li><p>Bảo vệ khỏi social engineering và lạm dụng tính năng khôi phục.</p></li><li><p>Sử dụng lịch sử thiết bị, tín hiệu từ lần đăng nhập trước và hệ thống chấm điểm rủi ro.</p></li><li><p>Xây dựng quy trình cho cả trường hợp người dùng mất <em>tất cả</em> thiết bị.</p></li></ul><h5><strong>2) Network Security và Bảo vệ Lưu lượng</strong></h5><p><strong>➤ Thiết kế pipeline phát hiện và giảm thiểu DDoS</strong></p><ul><li><p>Hiểu các kiểu tấn công volumetric, tấn công tầng giao thức, tầng ứng dụng.</p></li><li><p>Xây dựng hệ thống phân tích lưu lượng thời gian thực và cơ chế chặn tự động.</p></li><li><p>Lên phương án chống lại botnet, tấn công amplified và các traffic pattern bất thường.</p></li></ul><p><strong>➤ Thiết kế hệ thống lọc lưu lượng (traffic filtering) cho hạ tầng toàn cầu</strong></p><ul><li><p>Sử dụng ACL, firewall động và phân tích Deep Packet Inspection.</p></li><li><p>Phân phối việc lọc sang nhiều datacenter để giảm tải.</p></li><li><p>Đảm bảo việc chặn không gây gián đoạn dịch vụ.</p></li></ul><p><strong>➤ Xây dựng giải pháp bảo vệ API ở quy mô lớn</strong></p><ul><li><p>Tìm hiểu API gateway, rate limiting, throttling, và cơ chế chữ ký request (request signing).</p></li><li><p>Bảo vệ trước replay, injection, và abuse từ bot.</p></li><li><p>Xây dựng hệ thống giám sát lỗi bất thường theo thời gian thực.</p></li></ul><p><strong>➤ Thiết kế kiến trúc mTLS cho microservices</strong></p><ul><li><p>Quản lý certificate, xoay vòng khóa (key rotation), và trust store.</p></li><li><p>Bảo vệ khỏi MITM giữa các service.</p></li><li><p>Giữ mức độ trễ thấp dù bật mã hóa hai chiều.</p></li></ul><p><strong>➤ Xây dựng hệ thống phát hiện traffic bất thường theo thời gian thực</strong></p><ul><li><p>Sử dụng baseline traffic profile và anomaly detection.</p></li><li><p>Dùng mô hình học máy hoặc rule-based để phát hiện bất thường.</p></li><li><p>Xử lý false positive và tạo pipeline phản hồi tự động.</p></li></ul><h5><strong>3) Application Security &amp; Web Security</strong></h5><p><strong>➤ Thiết kế quy trình bảo mật cho CI/CD</strong></p><ul><li><p>Kiểm tra phụ thuộc (dependency scanning), bí mật (secret scanning).</p></li><li><p>Triển khai pipeline “break-glass”, chính sách signed build, và xác minh artifact.</p></li><li><p>Đảm bảo không release được nếu thiếu kiểm duyệt bảo mật.</p></li></ul><p><strong>➤ Xây dựng trình quét lỗ hổng tự động cho hệ thống web lớn</strong></p><ul><li><p>Kết hợp SAST, DAST, IAST.</p></li><li><p>Ưu tiên cảnh báo theo mức độ ảnh hưởng.</p></li><li><p>Tự động thu thập stack trace, log và input gây lỗi.</p></li></ul><p><strong>➤ Bảo vệ hệ thống khỏi injection (SQLi, NoSQLi, RCE)</strong></p><ul><li><p>Xây dựng thư viện chuẩn cho escaping, prepared statement.</p></li><li><p>Theo dõi các mẫu truy cập bất thường vào DB.</p></li><li><p>Ngăn chặn exploit do input phức tạp hoặc nested queries.</p></li></ul><p><strong>➤ Thiết kế cơ chế sandbox cho code thực thi động</strong></p><ul><li><p>Giới hạn CPU, RAM, mạng, syscalls.</p></li><li><p>Chạy trong container cô lập với namespace riêng.</p></li><li><p>Giám sát hành vi runtime để phát hiện escape attempt.</p></li></ul><p><strong>➤ Bảo vệ ứng dụng khỏi XSS và CSRF</strong></p><ul><li><p>Áp dụng CSP, secure cookies, và proper encoding.</p></li><li><p>Xác thực origin, kích hoạt SameSite cookies.</p></li><li><p>Giám sát template và UI injection.</p></li></ul><p><strong>➤ Thiết kế hệ thống rate limiting linh hoạt</strong></p><ul><li><p>Áp hạn mức theo IP, người dùng, thiết bị, hoặc API key.</p></li><li><p>Phát hiện patterns phức tạp: distributed attack, slowloris, algorithmic abuse.</p></li><li><p>Duy trì cache phân tán để xử lý hàng triệu request/s.</p></li></ul><h5><strong>4) Cloud Security &amp; Infrastructure</strong></h5><p><strong>➤ Thiết kế bảo mật cho multi-cloud ở quy mô doanh nghiệp</strong></p><ul><li><p>Kiểm soát IAM thống nhất cho nhiều môi trường.</p></li><li><p>Áp dụng network segmentation, private routing.</p></li><li><p>Bảo vệ secret, tài nguyên compute, và workload tự động.</p></li></ul><p><strong>➤ Xây dựng hệ thống quản lý secret an toàn</strong></p><ul><li><p>Sử dụng HSM, Vault, KMS.</p></li><li><p>Xoay vòng khóa tự động và theo dõi mọi lần truy cập.</p></li><li><p>Ngăn rò rỉ secret trong log, code, CI/CD.</p></li></ul><p><strong>➤ Thiết kế giải pháp giám sát bảo mật toàn công ty</strong></p><ul><li><p>Thu thập log từ hệ thống, ứng dụng, mạng.</p></li><li><p>Xây dựng bảng cảnh báo theo rule + machine learning.</p></li><li><p>Hỗ trợ đội Incident Response phân tích nhanh.</p></li></ul><p><strong>➤ Bảo vệ Kubernetes cluster</strong></p><ul><li><p>Kiểm soát RBAC, admission controller, và pod security.</p></li><li><p>Tách network policies giữa các namespace.</p></li><li><p>Phát hiện container escape và hành vi bất thường trong node.</p></li></ul><p><strong>➤ Thiết kế hệ thống kiểm kê tài nguyên tự động</strong></p><ul><li><p>Quét tài khoản cloud để phát hiện thiết lập sai (misconfiguration).</p></li><li><p>Tự động gửi cảnh báo khi tài nguyên công khai ngoài ý muốn.</p></li><li><p>Theo dõi cấu hình thay đổi theo thời gian.</p></li></ul><h5><strong>5) Data Security &amp; Privacy</strong></h5><p><strong>➤ Thiết kế hệ thống mã hóa end-to-end cho dữ liệu nhạy cảm</strong></p><ul><li><p>Quản lý khóa, phiên bản hóa khóa, và giới hạn quyền truy cập.</p></li><li><p>Phát hiện khi dữ liệu bị sao chép trái phép.</p></li><li><p>Duy trì khả năng truy xuất mà vẫn tuân thủ pháp lý.</p></li></ul><p><strong>➤ Xây dựng pipeline phân loại dữ liệu tự động</strong></p><ul><li><p>Dùng ML để phát hiện dữ liệu PII/PCI.</p></li><li><p>Gán nhãn, mã hóa, hoặc chặn truy cập theo chính sách.</p></li><li><p>Báo cáo cho đội compliance.</p></li></ul><p><strong>➤ Thiết kế cơ chế tokenization/anonymization</strong></p><ul><li><p>Tạo token không thể đảo ngược.</p></li><li><p>Bảo toàn tính toàn vẹn cho báo cáo và phân tích.</p></li><li><p>Giảm rủi ro nếu dữ liệu rò rỉ.</p></li></ul><p><strong>➤ Giám sát truy cập dữ liệu theo thời gian thực</strong></p><ul><li><p>Phân tích patterns bất thường của nhân viên.</p></li><li><p>Tự động khóa tài khoản khi nghi ngờ data exfiltration.</p></li><li><p>Tạo audit trail để điều tra.</p></li></ul><h5><strong>6) Detection Engineering &amp; Incident Response</strong></h5><p><strong>➤ Xây dựng hệ thống alert bảo mật chất lượng cao</strong></p><ul><li><p>Giảm false positive bằng risk scoring.</p></li><li><p>Kết hợp tín hiệu từ log ứng dụng, OS, mạng, endpoint.</p></li><li><p>Hỗ trợ cảnh báo tự động “truy theo chain tấn công”.</p></li></ul><p><strong>➤ Thiết kế hệ thống truy vết (forensics) nội bộ</strong></p><ul><li><p>Thu thập memory dump, disk snapshot, process timeline.</p></li><li><p>Tự động hóa điều tra với phân tích hành vi.</p></li><li><p>Hỗ trợ IR team xác định root cause nhanh.</p></li></ul><p><strong>➤ Xây dựng hệ thống phản hồi tự động (automated incident response)</strong></p><ul><li><p>Cô lập host, xoay vòng khóa, thu hồi token.</p></li><li><p>Đóng các lỗ hổng nghiêm trọng tự động khi bị khai thác.</p></li><li><p>Tích hợp SOC, SIEM, SOAR.</p></li></ul><p><strong>➤ Thiết kế mô phỏng tấn công (attack simulation/red teaming)</strong></p><ul><li><p>Mô phỏng phishing, pivoting, lateral movement.</p></li><li><p>Kiểm tra Zero Trust có hoạt động đúng không.</p></li><li><p>Đưa ra đề xuất vá lỗ hổng thực tế.</p></li></ul><p><strong>➤ Xây dựng cơ chế ứng phó sự cố cho dịch vụ 24/7</strong></p><ul><li><p>Quy trình on-call, escalation, triage.</p></li><li><p>Dashboard giám sát thời gian thực.</p></li><li><p>Đảm bảo phản hồi nhanh khi hàng triệu người dùng bị ảnh hưởng.</p></li></ul><h5><strong>7) Security Architecture &amp; Large-Scale Engineering</strong></h5><p><strong>➤ Thiết kế hệ thống logging và telemetry cho toàn công ty</strong></p><ul><li><p>Thu thập log từ hàng trăm dịch vụ mà không làm chậm hệ thống.</p></li><li><p>Chuẩn hóa log format và metadata bảo mật.</p></li><li><p>Xây dựng pipeline lưu trữ giá rẻ, truy vấn nhanh.</p></li></ul><p><strong>➤ Thiết kế cơ chế “blast radius reduction”</strong></p><ul><li><p>Tách biệt quyền truy cập theo thành phần nhỏ nhất.</p></li><li><p>Thiết lập giới hạn nghiêm ngặt để một lỗ hổng không lan rộng.</p></li><li><p>Tách môi trường test – staging – production hoàn toàn.</p></li></ul><p><strong>➤ Xây dựng framework bảo mật cho developer</strong></p><ul><li><p>Tạo thư viện chuẩn: auth, crypto, storage, logging.</p></li><li><p>Ngăn dev tự viết lại logic bảo mật nguy hiểm.</p></li><li><p>Tự động hóa code review với quy tắc bảo mật.</p></li></ul><p><strong>➤ Thiết kế cơ chế xử lý secret ở runtime</strong></p><ul><li><p>Tự động tải secret vào memory an toàn.</p></li><li><p>Không ghi secret vào log hoặc crash dump.</p></li><li><p>Hỗ trợ cập nhật secret mà không khởi động lại dịch vụ.</p></li></ul><p><strong>➤ Xây dựng hệ thống phân quyền cấp độ chi tiết (fine-grained access control)</strong></p><ul><li><p>Kiểm soát đến từng field dữ liệu, từng hành động.</p></li><li><p>Hỗ trợ audit, phục hồi và rollback quyền.</p></li><li><p>Giảm rủi ro quyền bị cấp sai.</p></li></ul><p>Hy vọng chia sẻ này có ích đến bạn!</p>",
        "tags": ["kafka", "security", "engineer", "roadmap"],
        "vote": 0,
        "commentCount": 0,
        "createdAt": "2025-11-19T11:22:10.376305Z",
        "updatedAt": "2025-11-19T11:27:47.825894Z"
    },
    {
        "id": 56,
        "communityId": 9,
        "community": {
            "id": 9,
            "name": "UI/UX Designers",
            "shortDescription": "Thiết kế giao diện và trải nghiệm người dùng"
        },
        "authorId": 1,
        "author": {
            "id": 1,
            "username": "nguyenvana",
            "avatar": "https://res.cloudinary.com/dd2dhsems/image/upload/v1762442989/images/post/cloudinary_post_b91ca9d0-8781-44cc-9b7d-fe48203ca9cd_1762442986.webp"
        },
        "title": "Hire me in Japan",
        "type": "text",
        "content": "<p>Tuyển dụng tôi tại Nhật Bản</p><p>11 tháng 11, 2025</p><p>Kỳ nghỉ phép của tôi sắp kết thúc, và tôi đang tìm kiếm một công việc mới.</p><p>Cụ thể, tôi đang tìm kiếm một công việc tại một công ty muốn tài trợ thị thực làm việc cho tôi tại Nhật Bản, nơi tôi muốn chuyển đến trong vòng một năm tới.</p><p>Nếu bạn có thể tài trợ thị thực kỹ sư phần mềm tại Nhật Bản và nghĩ rằng tôi phù hợp, vui lòng gửi email đến địa chỉ <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"text-blue-600 hover:underline\" href=\"mailto:dan.abramov.japan@gmail.com\">dan.abramov.japan@gmail.com</a>. Dưới đây, tôi sẽ tóm tắt một số công việc trước đây của mình, với thông tin chi tiết hơn về những gì tôi đang tìm kiếm ở gần cuối trang này.</p><p>(Chuyển đến cuối)</p><p>Công việc trước đây</p><p>Xin chào! Tôi tên là Dan Abramov.</p><p>Tôi bắt đầu lập trình khoảng 20 năm trước và sau đó tôi không thể dừng lại—vì vậy tôi đã làm việc chuyên nghiệp trong lĩnh vực phần mềm hơn 15 năm. Tôi đã thử sức với nhiều ngôn ngữ khác nhau, nhưng phần lớn các công việc gần đây của tôi đều liên quan đến JavaScript và TypeScript.</p><p>Sau đây là một vài điều tôi đã làm trong những năm qua.</p><p>2025: Tư vấn</p><p>Năm nay, tôi làm tư vấn, nên không có nhiều điều tôi có thể chia sẻ công khai.</p><p>Chủ yếu, tôi tư vấn cho các nhóm sử dụng React về cách tiếp cận các thách thức kỹ thuật liên quan đến hiệu suất và quản lý trạng thái trong các ứng dụng phức tạp.</p><p>Ngoài ra, tôi cũng đóng góp vào sách giáo khoa Phân tích của Terence Tao trong Lean.</p><p>2023–2025: Ứng dụng Bluesky</p><p>Từ năm 2023 đến 2025, tôi đã làm việc trên ứng dụng khách Bluesky chính thức (trong React Native). Phần lớn công việc kỹ thuật của tôi tập trung vào việc cải thiện chất lượng ứng dụng, ví dụ:</p><p>Triển khai hoạt ảnh cho hộp đèn</p><p>Đồng bộ hóa hoạt ảnh vuốt nguồn cấp dữ liệu với cử chỉ</p><p>Giới thiệu các quy tắc kiểm tra lỗi tùy chỉnh để ngăn chặn sự cố thời gian chạy</p><p>Giảm thời gian khởi động Android xuống còn vài giây</p><p>Một số công việc này đòi hỏi phải nghiên cứu chuyên sâu trong nhiều tuần và tái cấu trúc lại toàn diện.</p><p>Viết lại lightbox để hoạt động tốt trên Android</p><p>Tái thiết kế bố cục đa nền tảng để hoạt động tốt trên web</p><p>Cải tiến cách hiển thị luồng trong nguồn cấp dữ liệu</p><p>Cải tiến trình soạn thảo bài đăng thành trình soạn thảo luồng</p><p>Ứng dụng Bluesky là mã nguồn mở; đây là liên kết đến các yêu cầu kéo đã hợp nhất khác của tôi.</p><p>Chúng tôi đã sử dụng rất nhiều phần mềm mã nguồn mở tại Bluesky, và đôi khi việc tìm ra lỗi đến từ đâu có thể rất khó khăn. Thỉnh thoảng, tôi phải điều tra sâu vào các dự án cơ bản để ghi nhận lỗi hoặc sửa lỗi.</p><p>Giảm lưu lượng tuần tự hóa Reanimated</p><p>Sửa lỗi ScrollView 10 năm tuổi trong React Native</p><p>Ghi lại những khó khăn trong việc sử dụng cử chỉ với ScrollView</p><p>Ngoài công việc kỹ thuật cá nhân, tôi còn tham gia quản lý kỹ thuật và cố vấn cho nhóm ứng dụng. Bao gồm:</p><p>Giúp nhóm có được mô hình tư duy tự nhiên để làm việc với React.</p><p>Hướng dẫn nhóm ứng dụng cách tìm ra nguyên nhân gốc rễ của các vấn đề đặc biệt khó khăn.</p><p>Thúc đẩy sự hợp tác chặt chẽ hơn với nhóm back-end để những điểm chưa hoàn thiện từ sự phân chia tổ chức máy khách/máy chủ không \"thể hiện\" là trải nghiệm người dùng kém trong sản phẩm.</p><p>Tôi cũng đã giúp nhóm giải thích giao thức AT cho cộng đồng rộng lớn hơn—đầu tiên là trong một bài nói chuyện năm ngoái, sau đó được đúc kết thành bài viết gần đây của tôi có tên là Open Social.</p><p>2015–2023: React tại Meta/Facebook</p><p>Trước Bluesky, tôi từng làm việc trong nhóm React tại Meta (trước đây là Facebook). Một số dự án nổi bật mà tôi đã tham gia bao gồm:</p><p>Tài liệu React, do tôi đồng biên soạn với Rachel Lee Nabors và những người khác. Công việc của tôi bao gồm thiết kế chương trình giảng dạy phần Học, lặp lại cấu trúc trang Tham khảo, một phần lớn công việc kỹ thuật trên chính trang web và phần lớn nội dung viết, bao gồm thiết kế các ví dụ và thử thách.</p><p>Thông điệp công khai và triển khai React Hooks, bao gồm tài liệu gốc cho React Hooks và bài nói chuyện tại hội nghị giới thiệu về chúng.</p><p>Triển khai Fast Refresh (tải lại nhanh/chỉnh sửa trực tiếp) như một tính năng React hàng đầu. Cảm giác như đã xa lắm rồi, nhưng chúng tôi từng nhấn Cmd+R để xem các chỉnh sửa của mình.</p><p>Đồng sáng tạo ứng dụng Create React, chấm dứt tình trạng \"mệt mỏi với JavaScript\" (theo như lời đồn).</p><p>Tôi cũng đã thực hiện một số công việc kỹ thuật khác về React trong những năm qua, chủ yếu bao gồm sửa lỗi và đôi khi cải tiến cơ sở hạ tầng xây dựng.</p><p>Ngoài công việc, tôi đã đồng sáng tạo Just JavaScript, một cuốn sách giới thiệu về tư duy JavaScript, vừa mang tính đột phá vừa nghiêm ngặt.</p><p>Trước năm 2015</p><p>Tôi chưa làm được nhiều việc đáng chú ý trước khi được Facebook tuyển dụng, ngoài việc vô tình đồng sáng tạo Redux làm bản demo cho bài thuyết trình tại hội nghị của tôi.</p><p>Trước đây, tôi đã làm việc tại một công ty sản phẩm nhỏ nhưng không thành công với JavaScript và C#, và trước đó nữa là tại một công ty gia công phần mềm, nơi tôi chủ yếu làm C#.</p><p>Tôi cũng đã tạo ra React Hot Loader (tiền thân của Fast Refresh, hiện được tích hợp sẵn trong React), React DnD và normalizr (đã được Twitter sử dụng trong một thời gian).</p><p>Mong đợi</p><p>Như bạn có thể thấy từ những điều trên, phần lớn chuyên môn kỹ thuật của tôi nằm ở lĩnh vực kỹ thuật UI, đặc biệt là phát triển web, và tất nhiên là cả việc sử dụng React. Tôi rất mong có cơ hội được chia sẻ chuyên môn của mình và giúp bạn tạo ra những ứng dụng tốt hơn.</p><p>Tôi thích chia sẻ những gì mình đã học được, đó là lý do tại sao tôi viết blog và thực hiện các buổi nói chuyện.</p>",
        "tags": ["carreer", "job", "japan", "visa"],
        "vote": 0,
        "commentCount": 0,
        "createdAt": "2025-11-19T11:14:23.317136Z",
        "updatedAt": "2025-11-19T11:14:23.317136Z"
    },    
    
]
  */

  return (
    <div className="space-y-4">
      {/* Filter and Sort Bar */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-2.5 rounded-2xl border border-gray-200 px-4 py-2 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md">
                <CurrentSortIcon className={`size-4 ${currentSort?.color}`} />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                  {currentSort?.label}
                </span>
                <ChevronDown className="size-4 text-gray-400 transition-transform group-hover:text-blue-600 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                const isActive = sortBy === option.value;

                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`
                    flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200
                    ${
                      isActive
                        ? 'border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                        : 'hover:bg-gray-50'
                    }
                  `}
                  >
                    <Icon
                      className={`size-4 ${isActive ? option.color : 'text-gray-400'}`}
                    />
                    <span
                      className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto size-2 animate-pulse rounded-full bg-blue-600" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tags Filter */}
          <div className="flex-1 md:max-w-md">
            <SelectTags value={selectedTags} onChange={setSelectedTags} />
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-600">No posts found</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <DashboardPostCard key={post.id} post={post} index={index} />
          ))
        )}
      </div>

      {/* Infinite Scroll Sentinel & Loading Indicator */}
      {hasNextPage && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-gray-600">Loading more posts...</p>
            </div>
          )}
        </div>
      )}

      {/* End of feed message */}
      {!hasNextPage && posts.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
          <p className="text-sm font-medium text-gray-700">
            🎉 You have reached the end! No more posts to load.
          </p>
        </div>
      )}
    </div>
  );
};
