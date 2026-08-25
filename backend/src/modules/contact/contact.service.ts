import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactMessage } from './contact-message.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreateContactDto } from './create-contact.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  private readonly CONTACT_MAIL_TO: string;
  private readonly RATE_LIMIT_MINUTES = 15;

  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepo: Repository<ContactMessage>,
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {
    this.CONTACT_MAIL_TO =
      this.configService.get<string>('CONTACT_MAIL_TO') ?? '';
  }

  async send(dto: CreateContactDto, ip: string): Promise<void> {
    if (dto.website) return;

    const since = new Date(Date.now() - this.RATE_LIMIT_MINUTES * 60 * 1000);
    const recent = await this.contactRepo.findOne({
      where: { ipAddress: ip, createdAt: MoreThan(since) },
    });

    if (recent) {
      throw new HttpException(
        `You can send one message every ${this.RATE_LIMIT_MINUTES} minutes.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const contact = this.contactRepo.create({ ...dto, ipAddress: ip });
    await this.contactRepo.save(contact);

    this.mailerService
      .sendMail({
        to: this.CONTACT_MAIL_TO,
        subject: `New message from ${dto.firstName} ${dto.lastName}`,
        html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${dto.firstName} ${dto.lastName}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Phone:</strong> ${dto.phone ?? '—'}</p>
        <hr />
        <p>${dto.message.replace(/\n/g, '<br />')}</p>
      `,
      })
      .catch((err) => console.error('Mail error:', err));
  }
}
